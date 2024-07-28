import db from '../client';

export async function getMainInfo() {
  return (await db.query.mainInfoTable.findFirst({}))!;
}
