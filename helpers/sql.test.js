
const { sqlForPartialUpdate } = require('./sql')
const { BadRequestError } = require('../expressError');

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
describe("sqlForPartialUpdate", function () {
  test("works:", function () {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = { firstName: 'first_name' };
    
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

  expect(result).toEqual({
    setCols: '"first_name"=$1, "age"=$2',
    values: ['Aliya', 32]
  });
  })
  test('works: no jsToSql mapping', () => {
    const dataToUpdate = { age: 25, city: 'New York' };
    const jsToSql = {}; // no jsToSql mapping provided

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    expect(result).toEqual({
      setCols: '"age"=$1, "city"=$2',
      values: [25, 'New York']
    });
  });
  test('throws BadRequestError if no data', () => {
    const dataToUpdate = {};
    const jsToSql = { firstName: 'first_name' };

    expect(sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
  });
})