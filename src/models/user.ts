import { presenceValidator } from "@rawmodel/validators";
import {
  PopulateStrategy,
  SerializedStrategy,
  SystemErrorCode,
  ValidatorErrorCode,
} from "../config/values";
import { enumInclusionValidator, uniqueFieldValue } from "../lib/validators";
import { BaseSqlModel, prop } from "./base-sql-model";
import { stringTrimParser } from "../lib/parsers";
import { dateParser, integerParser, stringParser } from "@rawmodel/parsers";
import { Context } from "../context";
import { SqlError } from "../lib/errors";
import { getQueryParams, selectAndCountQuery } from "../lib/sql-utils";

export class User extends BaseSqlModel {
  /**
   * wallet
   */
  protected _tableName = "user";

  /**
   * email
   */
  @prop({
    parser: { resolver: stringTrimParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    validators: [
      {
        resolver: presenceValidator(),
        code: ValidatorErrorCode.PROFILE_EMAIL_NOT_PRESENT,
      },
      {
        resolver: uniqueFieldValue("user", "email"),
        code: ValidatorErrorCode.PROFILE_EMAIL_ALREADY_TAKEN,
      },
    ],
    fakeValue: "test@email.com",
  })
  public email: string;

  /**
   * nft_id
   */
  @prop({
    parser: { resolver: stringParser() },
    populatable: [PopulateStrategy.DB, PopulateStrategy.ADMIN],
    serializable: [
      SerializedStrategy.DB,
      SerializedStrategy.PROFILE,
      SerializedStrategy.ADMIN,
    ],
    fakeValue: "user",
  })
  public username: string;

  /**
   * Class constructor.
   * @param data Input data.
   * @param context Context.
   */
  public constructor(data?: any, context?: Context) {
    super(data, { context });
  }

  public async create() {
    const conn = await this.db().start();

    try {
      await this.insert(SerializedStrategy.DB, conn);
      await this.db().commit(conn);
    } catch (err) {
      await this.db().rollback(conn);
      throw new SqlError(
        err,
        this.getContext(),
        SystemErrorCode.DATABASE_ERROR,
        "user/create"
      );
    }
  }

  public async populateByEmail(email: string) {
    const data = await this.db().paramQuery(
      `
      SELECT * FROM ${this._tableName}
      WHERE email = @email
    `,
      { email }
    );

    if (data && data.length) {
      return this.populate(data[0], PopulateStrategy.DB);
    } else {
      return this.reset();
    }
  }

  /**
   * returns list of matched users
   * @param urlQuery search/paging/order parameters
   */
  public async getList(urlQuery) {
    // set default values or null for all params that we pass to sql query
    const defaultParams = {
      id: null,
      email: null,
      status: null,
    };

    // map url query with sql fields
    const fieldMap = {
      id: "u.id",
      email: "u.email",
      status: "u.status",
    };
    const { params, filters } = getQueryParams(
      defaultParams,
      "u",
      fieldMap,
      urlQuery
    );
    if (filters.limit === -1) {
      filters.limit = null;
    }

    let serializedStrategy = SerializedStrategy.ADMIN;
    const sqlQuery = {
      qSelect: `
        SELECT
          u.id, u.email, u.username,
          u.createTime, u.updateTime
        `,
      qFrom: `
        FROM user u
        WHERE
          (@id IS NULL OR u.id = @id)
          AND (@email IS NULL OR u.email LIKE CONCAT('%', @email, '%'))
          AND (@username IS NULL OR u.username LIKE CONCAT('%', @username, '%'))
          AND (@status IS NULL OR u.status = @status)
        `,
      qGroup: `
        `,
      qFilter: `
        ORDER BY ${
          filters.orderArr
            ? `${filters.orderArr.join(", ") || "u.updateTime DESC"}`
            : "u.updateTime DESC"
        }
        ${
          filters.limit !== null
            ? `LIMIT ${filters.limit} OFFSET ${filters.offset}`
            : ""
        };
      `,
    };

    const { items, total } = await selectAndCountQuery(
      this.db(),
      sqlQuery,
      params,
      "u.id"
    );
    const conn = await this.db().db.getConnection();
    try {
      const populatedItems = await Promise.all(
        items.map(async (item) => {
          const u = new User({}, this.getContext()).populate(
            item,
            PopulateStrategy.DB
          );
          return u.serialize(serializedStrategy);
        })
      );
      return { items: populatedItems, total };
    } catch (e) {
      throw e;
    } finally {
      await conn.release();
    }
  }
}
