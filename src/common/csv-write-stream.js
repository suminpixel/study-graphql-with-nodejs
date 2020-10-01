const stream = require('stream');
const fs = require('fs');
const through2 = require('through2');

//파일 스트림을 열고 닫아주는 클래스 
class CsvWriter extends stream.Transform {
  constructor(options = {}) {
    super({
      objectMode: true,
    });

    this.headers = null;
    this._first = true;
  }

  _transform(chunk, encoding, next) {
    if (!this.headers) this.headers = Object.keys(chunk);

    if (this._first && this.headers) {
      this._first = false;
      this.push(this.headers.join(',') + '\n');
    }
    const row =
      this.headers
        .map((v) => {
          const c = chunk[v];
          if (!c) next(new Error('can not find value in key of ' + v));
          return c;
        })
        .join(',') + '\n';
    this.push(row);
    next();
  }
}

// const writer = new CsvWriter();
// writer.pipe(fs.createWriteStream('./user3.csv'));
// for (let i = 0; i < 10000; i++) {
//   writer.write({ id: String(i), name: `user-${i}` });
// }

//객체를 csv로 변환
const ObjToCsv = through2.ctor({ objectMode: true, header: true }, function (record, encoding, next) {
  this.headers = Object.keys(record);
  if (this.options.header && this.headers) {
    this.options.header = false;
    this.push(this.headers.join(',') + '\n');
  }
  const row = this.headers.map((v) => record[v]).join(',') + '\n';
  this.push(row);
  next();
});
// const c = ObjToCsv();
// c.pipe(fs.createWriteStream('./user2.csv'));
// c.write({ id: '22', name: '33' });
// c.write({ id: '22', name: '33' });
// c.write({ id: '22', name: '33' });
// c.write({ id: '22', name: '33' });
// c.end();

module.exports = CsvWriter;
