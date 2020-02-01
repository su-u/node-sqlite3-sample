import UserTable, { DBCommon, User } from './usertable';

const main = async () => {
  DBCommon.init();
  console.log('--- create table ---');
  await UserTable.createTableIfNotExists();

  console.log('--- save 10 users ---');
  for (let i = 0; i < 10; i++) {
    const user = new User(`account${i}`, `name${i}`, `aaa${i}@bbb.ccc`);
    await UserTable.save(user);
  }

  console.log('--- count after saving ---');
  let count = await UserTable.count();
  console.log(count);

  console.log('--- update 3 users ---');
  for (let i = 3; i < 6; i++) {
    const user = new User(`account${i}`, `new-name${i}`, `xxx${i}@yyy.zzz`);
    await UserTable.save(user);
  }

  console.log('--- list ---');
  let start = 0;
  const limit = 3;
  let users: any = [];
  while (true) {
    users = users.concat(await UserTable.list(start, limit));
    start = start + limit;
    // @ts-ignore
    if (start >= count) break;
  }
  console.log(users);

  console.log('--- delete 10 users ---');
  users.forEach((user: any) => {
    UserTable.delete(user);
  });

  console.log('--- count after deleting ---');
  count = await UserTable.count();
  console.log(count);
};

main();