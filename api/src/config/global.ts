/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-template-curly-in-string */
// import { types } from 'pg';
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
import { types } from 'pg';

// Configura o Date para retornar o Json considerando o Timezone
Date.prototype.toJSON = function () {
  return this.toISOString();
};

types.setTypeParser(20, (v: any) => parseInt(v, 10));
types.setTypeParser(21, (v: any) => parseInt(v, 10));
types.setTypeParser(23, (v: any) => parseInt(v, 10));

types.setTypeParser(700, (v: any) => parseFloat(v));
types.setTypeParser(701, (v: any) => parseFloat(v));
types.setTypeParser(1700, (v: any) => parseFloat(v));

/**
    BOOL = 16,
    BYTEA = 17,
    CHAR = 18,
    INT8 = 20,
    INT2 = 21,
    INT4 = 23,
    REGPROC = 24,
    TEXT = 25,
    OID = 26,
    TID = 27,
    XID = 28,
    CID = 29,
    JSON = 114,
    XML = 142,
    PG_NODE_TREE = 194,
    SMGR = 210,
    PATH = 602,
    POLYGON = 604,
    CIDR = 650,
    FLOAT4 = 700,
    FLOAT8 = 701,
    ABSTIME = 702,
    RELTIME = 703,
    TINTERVAL = 704,
    CIRCLE = 718,
    MACADDR8 = 774,
    MONEY = 790,
    MACADDR = 829,
    INET = 869,
    ACLITEM = 1033,
    BPCHAR = 1042,
    VARCHAR = 1043,
    DATE = 1082,
    TIME = 1083,
    TIMESTAMP = 1114,
    TIMESTAMPTZ = 1184,
    INTERVAL = 1186,
    TIMETZ = 1266,
    BIT = 1560,
    VARBIT = 1562,
    NUMERIC = 1700,
    REFCURSOR = 1790,
    REGPROCEDURE = 2202,
    REGOPER = 2203,
    REGOPERATOR = 2204,
    REGCLASS = 2205,
    REGTYPE = 2206,
    UUID = 2950,
    TXID_SNAPSHOT = 2970,
    PG_LSN = 3220,
    PG_NDISTINCT = 3361,
    PG_DEPENDENCIES = 3402,
    TSVECTOR = 3614,
    TSQUERY = 3615,
    GTSVECTOR = 3642,
    REGCONFIG = 3734,
    REGDICTIONARY = 3769,
    JSONB = 3802,
    REGNAMESPACE = 4089,
    REGROLE = 4096
 */
