// https://deno.land/std@0.168.0/encoding/_yaml/error.ts
var YAMLError = class extends Error {
  constructor(message = "(unknown reason)", mark = "") {
    super(`${message} ${mark}`);
    this.mark = mark;
    this.name = this.constructor.name;
  }
  toString(_compact) {
    return `${this.name}: ${this.message} ${this.mark}`;
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/utils.ts
function isBoolean(value) {
  return typeof value === "boolean" || value instanceof Boolean;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function repeat(str2, count) {
  let result = "";
  for (let cycle = 0; cycle < count; cycle++) {
    result += str2;
  }
  return result;
}
function isNegativeZero(i) {
  return i === 0 && Number.NEGATIVE_INFINITY === 1 / i;
}

// https://deno.land/std@0.168.0/encoding/_yaml/mark.ts
var Mark = class {
  constructor(name, buffer, position, line, column) {
    this.name = name;
    this.buffer = buffer;
    this.position = position;
    this.line = line;
    this.column = column;
  }
  getSnippet(indent2 = 4, maxLength = 75) {
    if (!this.buffer)
      return null;
    let head = "";
    let start = this.position;
    while (start > 0 && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(start - 1)) === -1) {
      start -= 1;
      if (this.position - start > maxLength / 2 - 1) {
        head = " ... ";
        start += 5;
        break;
      }
    }
    let tail = "";
    let end = this.position;
    while (end < this.buffer.length && "\0\r\n\x85\u2028\u2029".indexOf(this.buffer.charAt(end)) === -1) {
      end += 1;
      if (end - this.position > maxLength / 2 - 1) {
        tail = " ... ";
        end -= 5;
        break;
      }
    }
    const snippet = this.buffer.slice(start, end);
    return `${repeat(" ", indent2)}${head}${snippet}${tail}
${repeat(
      " ",
      indent2 + this.position - start + head.length
    )}^`;
  }
  toString(compact) {
    let snippet, where = "";
    if (this.name) {
      where += `in "${this.name}" `;
    }
    where += `at line ${this.line + 1}, column ${this.column + 1}`;
    if (!compact) {
      snippet = this.getSnippet();
      if (snippet) {
        where += `:
${snippet}`;
      }
    }
    return where;
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/schema.ts
function compileList(schema, name, result) {
  const exclude = [];
  for (const includedSchema of schema.include) {
    result = compileList(includedSchema, name, result);
  }
  for (const currentType of schema[name]) {
    for (let previousIndex = 0; previousIndex < result.length; previousIndex++) {
      const previousType = result[previousIndex];
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
        exclude.push(previousIndex);
      }
    }
    result.push(currentType);
  }
  return result.filter((_type, index) => !exclude.includes(index));
}
function compileMap(...typesList) {
  const result = {
    fallback: {},
    mapping: {},
    scalar: {},
    sequence: {}
  };
  for (const types of typesList) {
    for (const type of types) {
      if (type.kind !== null) {
        result[type.kind][type.tag] = result["fallback"][type.tag] = type;
      }
    }
  }
  return result;
}
var Schema = class _Schema {
  static SCHEMA_DEFAULT;
  implicit;
  explicit;
  include;
  compiledImplicit;
  compiledExplicit;
  compiledTypeMap;
  constructor(definition) {
    this.explicit = definition.explicit || [];
    this.implicit = definition.implicit || [];
    this.include = definition.include || [];
    for (const type of this.implicit) {
      if (type.loadKind && type.loadKind !== "scalar") {
        throw new YAMLError(
          "There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported."
        );
      }
    }
    this.compiledImplicit = compileList(this, "implicit", []);
    this.compiledExplicit = compileList(this, "explicit", []);
    this.compiledTypeMap = compileMap(
      this.compiledImplicit,
      this.compiledExplicit
    );
  }
  /* Returns a new extended schema from current schema */
  extend(definition) {
    return new _Schema({
      implicit: [
        .../* @__PURE__ */ new Set([...this.implicit, ...definition?.implicit ?? []])
      ],
      explicit: [
        .../* @__PURE__ */ new Set([...this.explicit, ...definition?.explicit ?? []])
      ],
      include: [.../* @__PURE__ */ new Set([...this.include, ...definition?.include ?? []])]
    });
  }
  static create() {
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/type.ts
var DEFAULT_RESOLVE = () => true;
var DEFAULT_CONSTRUCT = (data) => data;
function checkTagFormat(tag) {
  return tag;
}
var Type = class {
  tag;
  kind = null;
  instanceOf;
  predicate;
  represent;
  defaultStyle;
  styleAliases;
  loadKind;
  constructor(tag, options) {
    this.tag = checkTagFormat(tag);
    if (options) {
      this.kind = options.kind;
      this.resolve = options.resolve || DEFAULT_RESOLVE;
      this.construct = options.construct || DEFAULT_CONSTRUCT;
      this.instanceOf = options.instanceOf;
      this.predicate = options.predicate;
      this.represent = options.represent;
      this.defaultStyle = options.defaultStyle;
      this.styleAliases = options.styleAliases;
    }
  }
  resolve = () => true;
  construct = (data) => data;
};

// https://deno.land/std@0.168.0/_util/asserts.ts
var DenoStdInternalError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "DenoStdInternalError";
  }
};
function assert(expr, msg = "") {
  if (!expr) {
    throw new DenoStdInternalError(msg);
  }
}

// https://deno.land/std@0.168.0/bytes/copy.ts
function copy(src, dst, off = 0) {
  off = Math.max(0, Math.min(off, dst.byteLength));
  const dstBytesAvailable = dst.byteLength - off;
  if (src.byteLength > dstBytesAvailable) {
    src = src.subarray(0, dstBytesAvailable);
  }
  dst.set(src, off);
  return src.byteLength;
}

// https://deno.land/std@0.168.0/io/buf_reader.ts
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);

// https://deno.land/std@0.168.0/io/buffer.ts
var MIN_READ = 32 * 1024;
var MAX_SIZE = 2 ** 32 - 2;
var Buffer = class {
  #buf;
  // contents are the bytes buf[off : len(buf)]
  #off = 0;
  // read at buf[off], write at buf[buf.byteLength]
  constructor(ab) {
    this.#buf = ab === void 0 ? new Uint8Array(0) : new Uint8Array(ab);
  }
  /** Returns a slice holding the unread portion of the buffer.
   *
   * The slice is valid for use only until the next buffer modification (that
   * is, only until the next call to a method like `read()`, `write()`,
   * `reset()`, or `truncate()`). If `options.copy` is false the slice aliases the buffer content at
   * least until the next buffer modification, so immediate changes to the
   * slice will affect the result of future reads.
   * @param [options={ copy: true }]
   */
  bytes(options = { copy: true }) {
    if (options.copy === false)
      return this.#buf.subarray(this.#off);
    return this.#buf.slice(this.#off);
  }
  /** Returns whether the unread portion of the buffer is empty. */
  empty() {
    return this.#buf.byteLength <= this.#off;
  }
  /** A read only number of bytes of the unread portion of the buffer. */
  get length() {
    return this.#buf.byteLength - this.#off;
  }
  /** The read only capacity of the buffer's underlying byte slice, that is,
   * the total space allocated for the buffer's data. */
  get capacity() {
    return this.#buf.buffer.byteLength;
  }
  /** Discards all but the first `n` unread bytes from the buffer but
   * continues to use the same allocated storage. It throws if `n` is
   * negative or greater than the length of the buffer. */
  truncate(n) {
    if (n === 0) {
      this.reset();
      return;
    }
    if (n < 0 || n > this.length) {
      throw Error("bytes.Buffer: truncation out of range");
    }
    this.#reslice(this.#off + n);
  }
  reset() {
    this.#reslice(0);
    this.#off = 0;
  }
  #tryGrowByReslice(n) {
    const l = this.#buf.byteLength;
    if (n <= this.capacity - l) {
      this.#reslice(l + n);
      return l;
    }
    return -1;
  }
  #reslice(len) {
    assert(len <= this.#buf.buffer.byteLength);
    this.#buf = new Uint8Array(this.#buf.buffer, 0, len);
  }
  /** Reads the next `p.length` bytes from the buffer or until the buffer is
   * drained. Returns the number of bytes read. If the buffer has no data to
   * return, the return is EOF (`null`). */
  readSync(p) {
    if (this.empty()) {
      this.reset();
      if (p.byteLength === 0) {
        return 0;
      }
      return null;
    }
    const nread = copy(this.#buf.subarray(this.#off), p);
    this.#off += nread;
    return nread;
  }
  /** Reads the next `p.length` bytes from the buffer or until the buffer is
   * drained. Resolves to the number of bytes read. If the buffer has no
   * data to return, resolves to EOF (`null`).
   *
   * NOTE: This methods reads bytes synchronously; it's provided for
   * compatibility with `Reader` interfaces.
   */
  read(p) {
    const rr = this.readSync(p);
    return Promise.resolve(rr);
  }
  writeSync(p) {
    const m = this.#grow(p.byteLength);
    return copy(p, this.#buf, m);
  }
  /** NOTE: This methods writes bytes synchronously; it's provided for
   * compatibility with `Writer` interface. */
  write(p) {
    const n = this.writeSync(p);
    return Promise.resolve(n);
  }
  #grow(n) {
    const m = this.length;
    if (m === 0 && this.#off !== 0) {
      this.reset();
    }
    const i = this.#tryGrowByReslice(n);
    if (i >= 0) {
      return i;
    }
    const c = this.capacity;
    if (n <= Math.floor(c / 2) - m) {
      copy(this.#buf.subarray(this.#off), this.#buf);
    } else if (c + n > MAX_SIZE) {
      throw new Error("The buffer cannot be grown beyond the maximum size.");
    } else {
      const buf = new Uint8Array(Math.min(2 * c + n, MAX_SIZE));
      copy(this.#buf.subarray(this.#off), buf);
      this.#buf = buf;
    }
    this.#off = 0;
    this.#reslice(Math.min(m + n, MAX_SIZE));
    return m;
  }
  /** Grows the buffer's capacity, if necessary, to guarantee space for
   * another `n` bytes. After `.grow(n)`, at least `n` bytes can be written to
   * the buffer without another allocation. If `n` is negative, `.grow()` will
   * throw. If the buffer can't grow it will throw an error.
   *
   * Based on Go Lang's
   * [Buffer.Grow](https://golang.org/pkg/bytes/#Buffer.Grow). */
  grow(n) {
    if (n < 0) {
      throw Error("Buffer.grow: negative count");
    }
    const m = this.#grow(n);
    this.#reslice(m);
  }
  /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
   * growing the buffer as needed. It resolves to the number of bytes read.
   * If the buffer becomes too large, `.readFrom()` will reject with an error.
   *
   * Based on Go Lang's
   * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
  async readFrom(r) {
    let n = 0;
    const tmp = new Uint8Array(MIN_READ);
    while (true) {
      const shouldGrow = this.capacity - this.length < MIN_READ;
      const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
      const nread = await r.read(buf);
      if (nread === null) {
        return n;
      }
      if (shouldGrow)
        this.writeSync(buf.subarray(0, nread));
      else
        this.#reslice(this.length + nread);
      n += nread;
    }
  }
  /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
   * growing the buffer as needed. It returns the number of bytes read. If the
   * buffer becomes too large, `.readFromSync()` will throw an error.
   *
   * Based on Go Lang's
   * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
  readFromSync(r) {
    let n = 0;
    const tmp = new Uint8Array(MIN_READ);
    while (true) {
      const shouldGrow = this.capacity - this.length < MIN_READ;
      const buf = shouldGrow ? tmp : new Uint8Array(this.#buf.buffer, this.length);
      const nread = r.readSync(buf);
      if (nread === null) {
        return n;
      }
      if (shouldGrow)
        this.writeSync(buf.subarray(0, nread));
      else
        this.#reslice(this.length + nread);
      n += nread;
    }
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/type/binary.ts
var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function resolveYamlBinary(data) {
  if (data === null)
    return false;
  let code;
  let bitlen = 0;
  const max = data.length;
  const map2 = BASE64_MAP;
  for (let idx = 0; idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64)
      continue;
    if (code < 0)
      return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  const input = data.replace(/[\r\n=]/g, "");
  const max = input.length;
  const map2 = BASE64_MAP;
  const result = [];
  let bits = 0;
  for (let idx = 0; idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  const tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Buffer(new Uint8Array(result));
}
function representYamlBinary(object) {
  const max = object.length;
  const map2 = BASE64_MAP;
  let result = "";
  let bits = 0;
  for (let idx = 0; idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  const tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  if (typeof obj?.readSync !== "function") {
    return false;
  }
  const buf = new Buffer();
  try {
    if (0 > buf.readFromSync(obj))
      return true;
    return false;
  } catch {
    return false;
  } finally {
    buf.reset();
  }
}
var binary = new Type("tag:yaml.org,2002:binary", {
  construct: constructYamlBinary,
  kind: "scalar",
  predicate: isBinary,
  represent: representYamlBinary,
  resolve: resolveYamlBinary
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/bool.ts
function resolveYamlBoolean(data) {
  const max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
var bool = new Type("tag:yaml.org,2002:bool", {
  construct: constructYamlBoolean,
  defaultStyle: "lowercase",
  kind: "scalar",
  predicate: isBoolean,
  represent: {
    lowercase(object) {
      return object ? "true" : "false";
    },
    uppercase(object) {
      return object ? "TRUE" : "FALSE";
    },
    camelcase(object) {
      return object ? "True" : "False";
    }
  },
  resolve: resolveYamlBoolean
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/float.ts
var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function resolveYamlFloat(data) {
  if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  let value = data.replace(/_/g, "").toLowerCase();
  const sign = value[0] === "-" ? -1 : 1;
  const digits = [];
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }
  if (value === ".nan") {
    return NaN;
  }
  if (value.indexOf(":") >= 0) {
    value.split(":").forEach((v) => {
      digits.unshift(parseFloat(v));
    });
    let valueNb = 0;
    let base = 1;
    digits.forEach((d) => {
      valueNb += d * base;
      base *= 60;
    });
    return sign * valueNb;
  }
  return sign * parseFloat(value);
}
var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
function representYamlFloat(object, style) {
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (isNegativeZero(object)) {
    return "-0.0";
  }
  const res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || isNegativeZero(object));
}
var float = new Type("tag:yaml.org,2002:float", {
  construct: constructYamlFloat,
  defaultStyle: "lowercase",
  kind: "scalar",
  predicate: isFloat,
  represent: representYamlFloat,
  resolve: resolveYamlFloat
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/function.ts
function reconstructFunction(code) {
  const func2 = new Function(`return ${code}`)();
  if (!(func2 instanceof Function)) {
    throw new TypeError(`Expected function but got ${typeof func2}: ${code}`);
  }
  return func2;
}
var func = new Type("tag:yaml.org,2002:js/function", {
  kind: "scalar",
  resolve(data) {
    if (data === null) {
      return false;
    }
    try {
      reconstructFunction(`${data}`);
      return true;
    } catch (_err) {
      return false;
    }
  },
  construct(data) {
    return reconstructFunction(data);
  },
  predicate(object) {
    return object instanceof Function;
  },
  represent(object) {
    return object.toString();
  }
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/int.ts
function isHexCode(c) {
  return 48 <= /* 0 */
  c && c <= 57 || 65 <= /* A */
  c && c <= 70 || 97 <= /* a */
  c && c <= 102;
}
function isOctCode(c) {
  return 48 <= /* 0 */
  c && c <= 55;
}
function isDecCode(c) {
  return 48 <= /* 0 */
  c && c <= 57;
}
function resolveYamlInteger(data) {
  const max = data.length;
  let index = 0;
  let hasDigits = false;
  if (!max)
    return false;
  let ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max)
      return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (ch !== "0" && ch !== "1")
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (; index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isHexCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_")
        continue;
      if (!isOctCode(data.charCodeAt(index)))
        return false;
      hasDigits = true;
    }
    return hasDigits && ch !== "_";
  }
  if (ch === "_")
    return false;
  for (; index < max; index++) {
    ch = data[index];
    if (ch === "_")
      continue;
    if (ch === ":")
      break;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_")
    return false;
  if (ch !== ":")
    return true;
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}
function constructYamlInteger(data) {
  let value = data;
  const digits = [];
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  let sign = 1;
  let ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-")
      sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0")
    return 0;
  if (ch === "0") {
    if (value[1] === "b")
      return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x")
      return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }
  if (value.indexOf(":") !== -1) {
    value.split(":").forEach((v) => {
      digits.unshift(parseInt(v, 10));
    });
    let valueInt = 0;
    let base = 1;
    digits.forEach((d) => {
      valueInt += d * base;
      base *= 60;
    });
    return sign * valueInt;
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && object % 1 === 0 && !isNegativeZero(object);
}
var int = new Type("tag:yaml.org,2002:int", {
  construct: constructYamlInteger,
  defaultStyle: "decimal",
  kind: "scalar",
  predicate: isInteger,
  represent: {
    binary(obj) {
      return obj >= 0 ? `0b${obj.toString(2)}` : `-0b${obj.toString(2).slice(1)}`;
    },
    octal(obj) {
      return obj >= 0 ? `0${obj.toString(8)}` : `-0${obj.toString(8).slice(1)}`;
    },
    decimal(obj) {
      return obj.toString(10);
    },
    hexadecimal(obj) {
      return obj >= 0 ? `0x${obj.toString(16).toUpperCase()}` : `-0x${obj.toString(16).toUpperCase().slice(1)}`;
    }
  },
  resolve: resolveYamlInteger,
  styleAliases: {
    binary: [2, "bin"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"],
    octal: [8, "oct"]
  }
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/map.ts
var map = new Type("tag:yaml.org,2002:map", {
  construct(data) {
    return data !== null ? data : {};
  },
  kind: "mapping"
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/merge.ts
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
var merge = new Type("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: resolveYamlMerge
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/nil.ts
function resolveYamlNull(data) {
  const max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
var nil = new Type("tag:yaml.org,2002:null", {
  construct: constructYamlNull,
  defaultStyle: "lowercase",
  kind: "scalar",
  predicate: isNull,
  represent: {
    canonical() {
      return "~";
    },
    lowercase() {
      return "null";
    },
    uppercase() {
      return "NULL";
    },
    camelcase() {
      return "Null";
    }
  },
  resolve: resolveYamlNull
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/omap.ts
var { hasOwn } = Object;
var _toString = Object.prototype.toString;
function resolveYamlOmap(data) {
  const objectKeys = [];
  let pairKey = "";
  let pairHasKey = false;
  for (const pair of data) {
    pairHasKey = false;
    if (_toString.call(pair) !== "[object Object]")
      return false;
    for (pairKey in pair) {
      if (hasOwn(pair, pairKey)) {
        if (!pairHasKey)
          pairHasKey = true;
        else
          return false;
      }
    }
    if (!pairHasKey)
      return false;
    if (objectKeys.indexOf(pairKey) === -1)
      objectKeys.push(pairKey);
    else
      return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
var omap = new Type("tag:yaml.org,2002:omap", {
  construct: constructYamlOmap,
  kind: "sequence",
  resolve: resolveYamlOmap
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/pairs.ts
var _toString2 = Object.prototype.toString;
function resolveYamlPairs(data) {
  const result = Array.from({ length: data.length });
  for (let index = 0; index < data.length; index++) {
    const pair = data[index];
    if (_toString2.call(pair) !== "[object Object]")
      return false;
    const keys = Object.keys(pair);
    if (keys.length !== 1)
      return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null)
    return [];
  const result = Array.from({ length: data.length });
  for (let index = 0; index < data.length; index += 1) {
    const pair = data[index];
    const keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
var pairs = new Type("tag:yaml.org,2002:pairs", {
  construct: constructYamlPairs,
  kind: "sequence",
  resolve: resolveYamlPairs
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/regexp.ts
var REGEXP = /^\/(?<regexp>[\s\S]+)\/(?<modifiers>[gismuy]*)$/;
var regexp = new Type("tag:yaml.org,2002:js/regexp", {
  kind: "scalar",
  resolve(data) {
    if (data === null || !data.length) {
      return false;
    }
    const regexp2 = `${data}`;
    if (regexp2.charAt(0) === "/") {
      if (!REGEXP.test(data)) {
        return false;
      }
      const modifiers = [...regexp2.match(REGEXP)?.groups?.modifiers ?? ""];
      if (new Set(modifiers).size < modifiers.length) {
        return false;
      }
    }
    return true;
  },
  construct(data) {
    const { regexp: regexp2 = `${data}`, modifiers = "" } = `${data}`.match(REGEXP)?.groups ?? {};
    return new RegExp(regexp2, modifiers);
  },
  predicate(object) {
    return object instanceof RegExp;
  },
  represent(object) {
    return object.toString();
  }
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/seq.ts
var seq = new Type("tag:yaml.org,2002:seq", {
  construct(data) {
    return data !== null ? data : [];
  },
  kind: "sequence"
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/set.ts
var { hasOwn: hasOwn2 } = Object;
function resolveYamlSet(data) {
  if (data === null)
    return true;
  for (const key in data) {
    if (hasOwn2(data, key)) {
      if (data[key] !== null)
        return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
var set = new Type("tag:yaml.org,2002:set", {
  construct: constructYamlSet,
  kind: "mapping",
  resolve: resolveYamlSet
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/str.ts
var str = new Type("tag:yaml.org,2002:str", {
  construct(data) {
    return data !== null ? data : "";
  },
  kind: "scalar"
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/timestamp.ts
var YAML_DATE_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  // [3] day
);
var YAML_TIMESTAMP_REGEXP = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  // [11] tz_minute
);
function resolveYamlTimestamp(data) {
  if (data === null)
    return false;
  if (YAML_DATE_REGEXP.exec(data) !== null)
    return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
    return true;
  return false;
}
function constructYamlTimestamp(data) {
  let match = YAML_DATE_REGEXP.exec(data);
  if (match === null)
    match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null)
    throw new Error("Date resolve error");
  const year = +match[1];
  const month = +match[2] - 1;
  const day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  const hour = +match[4];
  const minute = +match[5];
  const second = +match[6];
  let fraction = 0;
  if (match[7]) {
    let partFraction = match[7].slice(0, 3);
    while (partFraction.length < 3) {
      partFraction += "0";
    }
    fraction = +partFraction;
  }
  let delta = null;
  if (match[9]) {
    const tzHour = +match[10];
    const tzMinute = +(match[11] || 0);
    delta = (tzHour * 60 + tzMinute) * 6e4;
    if (match[9] === "-")
      delta = -delta;
  }
  const date = new Date(
    Date.UTC(year, month, day, hour, minute, second, fraction)
  );
  if (delta)
    date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(date) {
  return date.toISOString();
}
var timestamp = new Type("tag:yaml.org,2002:timestamp", {
  construct: constructYamlTimestamp,
  instanceOf: Date,
  kind: "scalar",
  represent: representYamlTimestamp,
  resolve: resolveYamlTimestamp
});

// https://deno.land/std@0.168.0/encoding/_yaml/type/undefined.ts
var undefinedType = new Type("tag:yaml.org,2002:js/undefined", {
  kind: "scalar",
  resolve() {
    return true;
  },
  construct() {
    return void 0;
  },
  predicate(object) {
    return typeof object === "undefined";
  },
  represent() {
    return "";
  }
});

// https://deno.land/std@0.168.0/encoding/_yaml/schema/failsafe.ts
var failsafe = new Schema({
  explicit: [str, seq, map]
});

// https://deno.land/std@0.168.0/encoding/_yaml/schema/json.ts
var json = new Schema({
  implicit: [nil, bool, int, float],
  include: [failsafe]
});

// https://deno.land/std@0.168.0/encoding/_yaml/schema/core.ts
var core = new Schema({
  include: [json]
});

// https://deno.land/std@0.168.0/encoding/_yaml/schema/default.ts
var def = new Schema({
  explicit: [binary, omap, pairs, set],
  implicit: [timestamp, merge],
  include: [core]
});

// https://deno.land/std@0.168.0/encoding/_yaml/schema/extended.ts
var extended = new Schema({
  explicit: [regexp, undefinedType],
  include: [def]
});

// https://deno.land/std@0.168.0/encoding/_yaml/state.ts
var State = class {
  constructor(schema = def) {
    this.schema = schema;
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/loader/loader_state.ts
var LoaderState = class extends State {
  constructor(input, {
    filename,
    schema,
    onWarning,
    legacy = false,
    json: json2 = false,
    listener = null
  }) {
    super(schema);
    this.input = input;
    this.filename = filename;
    this.onWarning = onWarning;
    this.legacy = legacy;
    this.json = json2;
    this.listener = listener;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
  }
  documents = [];
  length;
  lineIndent = 0;
  lineStart = 0;
  position = 0;
  line = 0;
  filename;
  onWarning;
  legacy;
  json;
  listener;
  implicitTypes;
  typeMap;
  version;
  checkLineBreaks;
  tagMap;
  anchorMap;
  tag;
  anchor;
  kind;
  result = "";
};

// https://deno.land/std@0.168.0/encoding/_yaml/loader/loader.ts
var { hasOwn: hasOwn3 } = Object;
var CONTEXT_FLOW_IN = 1;
var CONTEXT_FLOW_OUT = 2;
var CONTEXT_BLOCK_IN = 3;
var CONTEXT_BLOCK_OUT = 4;
var CHOMPING_CLIP = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP = 3;
var PATTERN_NON_PRINTABLE = (
  // deno-lint-ignore no-control-regex
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/
);
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function isEOL(c) {
  return c === 10 || /* LF */
  c === 13;
}
function isWhiteSpace(c) {
  return c === 9 || /* Tab */
  c === 32;
}
function isWsOrEol(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function isFlowIndicator(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  if (48 <= /* 0 */
  c && c <= 57) {
    return c - 48;
  }
  const lc = c | 32;
  if (97 <= /* a */
  lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= /* 0 */
  c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode(
    (c - 65536 >> 10) + 55296,
    (c - 65536 & 1023) + 56320
  );
}
var simpleEscapeCheck = Array.from({ length: 256 });
var simpleEscapeMap = Array.from({ length: 256 });
for (let i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}
function generateError(state, message) {
  return new YAMLError(
    message,
    new Mark(
      state.filename,
      state.input,
      state.position,
      state.line,
      state.position - state.lineStart
    )
  );
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
var directiveHandlers = {
  YAML(state, _name, ...args) {
    if (state.version !== null) {
      return throwError(state, "duplication of %YAML directive");
    }
    if (args.length !== 1) {
      return throwError(state, "YAML directive accepts exactly one argument");
    }
    const match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
    if (match === null) {
      return throwError(state, "ill-formed argument of the YAML directive");
    }
    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    if (major !== 1) {
      return throwError(state, "unacceptable YAML version of the document");
    }
    state.version = args[0];
    state.checkLineBreaks = minor < 2;
    if (minor !== 1 && minor !== 2) {
      return throwWarning(state, "unsupported YAML version of the document");
    }
  },
  TAG(state, _name, ...args) {
    if (args.length !== 2) {
      return throwError(state, "TAG directive accepts exactly two arguments");
    }
    const handle = args[0];
    const prefix = args[1];
    if (!PATTERN_TAG_HANDLE.test(handle)) {
      return throwError(
        state,
        "ill-formed tag handle (first argument) of the TAG directive"
      );
    }
    if (state.tagMap && hasOwn3(state.tagMap, handle)) {
      return throwError(
        state,
        `there is a previously declared suffix for "${handle}" tag handle`
      );
    }
    if (!PATTERN_TAG_URI.test(prefix)) {
      return throwError(
        state,
        "ill-formed tag prefix (second argument) of the TAG directive"
      );
    }
    if (typeof state.tagMap === "undefined") {
      state.tagMap = {};
    }
    state.tagMap[handle] = prefix;
  }
};
function captureSegment(state, start, end, checkJson) {
  let result;
  if (start < end) {
    result = state.input.slice(start, end);
    if (checkJson) {
      for (let position = 0, length = result.length; position < length; position++) {
        const character = result.charCodeAt(position);
        if (!(character === 9 || 32 <= character && character <= 1114111)) {
          return throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(result)) {
      return throwError(state, "the stream contains non-printable characters");
    }
    state.result += result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  if (!isObject(source)) {
    return throwError(
      state,
      "cannot merge mappings; the provided source object is unacceptable"
    );
  }
  const keys = Object.keys(source);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    if (!hasOwn3(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (let index = 0, quantity = keyNode.length; index < quantity; index++) {
      if (Array.isArray(keyNode[index])) {
        return throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (result === null) {
    result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (let index = 0, quantity = valueNode.length; index < quantity; index++) {
        mergeMappings(state, result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !hasOwn3(overridableKeys, keyNode) && hasOwn3(result, keyNode)) {
      state.line = startLine || state.line;
      state.position = startPos || state.position;
      return throwError(state, "duplicated mapping key");
    }
    result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }
  return result;
}
function readLineBreak(state) {
  const ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    return throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  let lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (isWhiteSpace(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && /* LF */
      ch !== 13 && /* CR */
      ch !== 0);
    }
    if (isEOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  let _position = state.position;
  let ch = state.input.charCodeAt(_position);
  if ((ch === 45 || /* - */
  ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || isWsOrEol(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += repeat("\n", count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  const kind = state.kind;
  const result = state.result;
  let ch = state.input.charCodeAt(state.position);
  if (isWsOrEol(ch) || isFlowIndicator(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  let following;
  if (ch === 63 || /* ? */
  ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  let captureEnd, captureStart = captureEnd = state.position;
  let hasPendingContent = false;
  let line = 0;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (isWsOrEol(following) || withinFlowCollection && isFlowIndicator(following)) {
        break;
      }
    } else if (ch === 35) {
      const preceding = state.input.charCodeAt(state.position - 1);
      if (isWsOrEol(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && isFlowIndicator(ch)) {
      break;
    } else if (isEOL(ch)) {
      line = state.line;
      const lineStart = state.lineStart;
      const lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = line;
        state.lineStart = lineStart;
        state.lineIndent = lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!isWhiteSpace(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = kind;
  state.result = result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  let ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (isEOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      return throwError(
        state,
        "unexpected end of the document within a single quoted scalar"
      );
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  return throwError(
    state,
    "unexpected end of the stream within a single quoted scalar"
  );
}
function readDoubleQuotedScalar(state, nodeIndent) {
  let ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  let captureEnd, captureStart = captureEnd = state.position;
  let tmp;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    }
    if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (isEOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        let hexLength = tmp;
        let hexResult = 0;
        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            return throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        return throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (isEOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      return throwError(
        state,
        "unexpected end of the document within a double quoted scalar"
      );
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  return throwError(
    state,
    "unexpected end of the stream within a double quoted scalar"
  );
}
function readFlowCollection(state, nodeIndent) {
  let ch = state.input.charCodeAt(state.position);
  let terminator;
  let isMapping = true;
  let result = {};
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    result = [];
  } else if (ch === 123) {
    terminator = 125;
  } else {
    return false;
  }
  if (state.anchor !== null && typeof state.anchor != "undefined" && typeof state.anchorMap != "undefined") {
    state.anchorMap[state.anchor] = result;
  }
  ch = state.input.charCodeAt(++state.position);
  const tag = state.tag, anchor = state.anchor;
  let readNext = true;
  let valueNode, keyNode, keyTag = keyNode = valueNode = null, isExplicitPair, isPair = isExplicitPair = false;
  let following = 0, line = 0;
  const overridableKeys = {};
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = tag;
      state.anchor = anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = result;
      return true;
    }
    if (!readNext) {
      return throwError(state, "missed comma between flow collection entries");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (isWsOrEol(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag || null;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(
        state,
        result,
        overridableKeys,
        keyTag,
        keyNode,
        valueNode
      );
    } else if (isPair) {
      result.push(
        storeMappingPair(
          state,
          null,
          overridableKeys,
          keyTag,
          keyNode,
          valueNode
        )
      );
    } else {
      result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  return throwError(
    state,
    "unexpected end of the stream within a flow collection"
  );
}
function readBlockScalar(state, nodeIndent) {
  let chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false;
  let ch = state.input.charCodeAt(state.position);
  let folding = false;
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  let tmp = 0;
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || /* + */
    ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        return throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        return throwError(
          state,
          "bad explicit indentation width of a block scalar; it cannot be less than one"
        );
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        return throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (isWhiteSpace(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (isWhiteSpace(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!isEOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (isEOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += repeat(
          "\n",
          didReadContent ? 1 + emptyLines : emptyLines
        );
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += "\n";
        }
      }
      break;
    }
    if (folding) {
      if (isWhiteSpace(ch)) {
        atMoreIndented = true;
        state.result += repeat(
          "\n",
          didReadContent ? 1 + emptyLines : emptyLines
        );
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += repeat("\n", emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += repeat("\n", emptyLines);
      }
    } else {
      state.result += repeat(
        "\n",
        didReadContent ? 1 + emptyLines : emptyLines
      );
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    const captureStart = state.position;
    while (!isEOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  let line, following, detected = false, ch;
  const tag = state.tag, anchor = state.anchor, result = [];
  if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
    state.anchorMap[state.anchor] = result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!isWsOrEol(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === line || state.lineIndent > nodeIndent) && ch !== 0) {
      return throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = tag;
    state.anchor = anchor;
    state.kind = "sequence";
    state.result = result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  const tag = state.tag, anchor = state.anchor, result = {}, overridableKeys = {};
  let following, allowCompact = false, line, pos, keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.anchor !== null && typeof state.anchor !== "undefined" && typeof state.anchorMap !== "undefined") {
    state.anchorMap[state.anchor] = result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    line = state.line;
    pos = state.position;
    if ((ch === 63 || /* ? */
    ch === 58) && /* : */
    isWsOrEol(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(
            state,
            result,
            overridableKeys,
            keyTag,
            keyNode,
            null
          );
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        return throwError(
          state,
          "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"
        );
      }
      state.position += 1;
      ch = following;
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
      if (state.line === line) {
        ch = state.input.charCodeAt(state.position);
        while (isWhiteSpace(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!isWsOrEol(ch)) {
            return throwError(
              state,
              "a whitespace character is expected after the key-value separator within a block mapping"
            );
          }
          if (atExplicitKey) {
            storeMappingPair(
              state,
              result,
              overridableKeys,
              keyTag,
              keyNode,
              null
            );
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          return throwError(
            state,
            "can not read an implicit mapping pair; a colon is missed"
          );
        } else {
          state.tag = tag;
          state.anchor = anchor;
          return true;
        }
      } else if (detected) {
        return throwError(
          state,
          "can not read a block mapping entry; a multiline key may not be an implicit key"
        );
      } else {
        state.tag = tag;
        state.anchor = anchor;
        return true;
      }
    } else {
      break;
    }
    if (state.line === line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(
          state,
          result,
          overridableKeys,
          keyTag,
          keyNode,
          valueNode,
          line,
          pos
        );
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if (state.lineIndent > nodeIndent && ch !== 0) {
      return throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(
      state,
      result,
      overridableKeys,
      keyTag,
      keyNode,
      null
    );
  }
  if (detected) {
    state.tag = tag;
    state.anchor = anchor;
    state.kind = "mapping";
    state.result = result;
  }
  return detected;
}
function readTagProperty(state) {
  let position, isVerbatim = false, isNamed = false, tagHandle = "", tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33)
    return false;
  if (state.tag !== null) {
    return throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      return throwError(
        state,
        "unexpected end of the stream within a verbatim tag"
      );
    }
  } else {
    while (ch !== 0 && !isWsOrEol(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            return throwError(
              state,
              "named tag handle cannot contain such characters"
            );
          }
          isNamed = true;
          position = state.position + 1;
        } else {
          return throwError(
            state,
            "tag suffix cannot contain exclamation marks"
          );
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      return throwError(
        state,
        "tag suffix cannot contain flow indicator characters"
      );
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    return throwError(
      state,
      `tag name cannot contain such characters: ${tagName}`
    );
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (typeof state.tagMap !== "undefined" && hasOwn3(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = `!${tagName}`;
  } else if (tagHandle === "!!") {
    state.tag = `tag:yaml.org,2002:${tagName}`;
  } else {
    return throwError(state, `undeclared tag handle "${tagHandle}"`);
  }
  return true;
}
function readAnchorProperty(state) {
  let ch = state.input.charCodeAt(state.position);
  if (ch !== 38)
    return false;
  if (state.anchor !== null) {
    return throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  const position = state.position;
  while (ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === position) {
    return throwError(
      state,
      "name of an anchor node must contain at least one character"
    );
  }
  state.anchor = state.input.slice(position, state.position);
  return true;
}
function readAlias(state) {
  let ch = state.input.charCodeAt(state.position);
  if (ch !== 42)
    return false;
  ch = state.input.charCodeAt(++state.position);
  const _position = state.position;
  while (ch !== 0 && !isWsOrEol(ch) && !isFlowIndicator(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    return throwError(
      state,
      "name of an alias node must contain at least one character"
    );
  }
  const alias = state.input.slice(_position, state.position);
  if (typeof state.anchorMap !== "undefined" && !hasOwn3(state.anchorMap, alias)) {
    return throwError(state, `unidentified alias "${alias}"`);
  }
  if (typeof state.anchorMap !== "undefined") {
    state.result = state.anchorMap[alias];
  }
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  let allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, type, flowIndent, blockIndent;
  if (state.listener && state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  const allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    const cond = CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext;
    flowIndent = cond ? parentIndent : parentIndent + 1;
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            return throwError(
              state,
              "alias node should not have Any properties"
            );
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag !== null && state.tag !== "!") {
    if (state.tag === "?") {
      for (let typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex++) {
        type = state.implicitTypes[typeIndex];
        if (type.resolve(state.result)) {
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (hasOwn3(state.typeMap[state.kind || "fallback"], state.tag)) {
      type = state.typeMap[state.kind || "fallback"][state.tag];
      if (state.result !== null && type.kind !== state.kind) {
        return throwError(
          state,
          `unacceptable node kind for !<${state.tag}> tag; it should be "${type.kind}", not "${state.kind}"`
        );
      }
      if (!type.resolve(state.result)) {
        return throwError(
          state,
          `cannot resolve a node with !<${state.tag}> explicit tag`
        );
      } else {
        state.result = type.construct(state.result);
        if (state.anchor !== null && typeof state.anchorMap !== "undefined") {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      return throwError(state, `unknown tag !<${state.tag}>`);
    }
  }
  if (state.listener && state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  const documentStart = state.position;
  let position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    position = state.position;
    while (ch !== 0 && !isWsOrEol(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      return throwError(
        state,
        "directive name must not be less than one character in length"
      );
    }
    while (ch !== 0) {
      while (isWhiteSpace(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !isEOL(ch));
        break;
      }
      if (isEOL(ch))
        break;
      position = state.position;
      while (ch !== 0 && !isWsOrEol(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(position, state.position));
    }
    if (ch !== 0)
      readLineBreak(state);
    if (hasOwn3(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, ...directiveArgs);
    } else {
      throwWarning(state, `unknown document directive "${directiveName}"`);
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    return throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(
    state.input.slice(documentStart, state.position)
  )) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    return throwError(
      state,
      "end of the stream or a document separator is expected"
    );
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += "\n";
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  const state = new LoaderState(input, options);
  state.input += "\0";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function load(input, options) {
  const documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return;
  }
  if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLError(
    "expected a single document in the stream, but found more"
  );
}

// https://deno.land/std@0.168.0/encoding/_yaml/parse.ts
function parse(content, options) {
  return load(content, options);
}

// https://deno.land/std@0.168.0/encoding/_yaml/dumper/dumper_state.ts
var { hasOwn: hasOwn4 } = Object;
function compileStyleMap(schema, map2) {
  if (typeof map2 === "undefined" || map2 === null)
    return {};
  let type;
  const result = {};
  const keys = Object.keys(map2);
  let tag, style;
  for (let index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = `tag:yaml.org,2002:${tag.slice(2)}`;
    }
    type = schema.compiledTypeMap.fallback[tag];
    if (type && typeof type.styleAliases !== "undefined" && hasOwn4(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
var DumperState = class extends State {
  indent;
  noArrayIndent;
  skipInvalid;
  flowLevel;
  sortKeys;
  lineWidth;
  noRefs;
  noCompatMode;
  condenseFlow;
  implicitTypes;
  explicitTypes;
  tag = null;
  result = "";
  duplicates = [];
  usedDuplicates = [];
  // changed from null to []
  styleMap;
  dump;
  constructor({
    schema,
    indent: indent2 = 2,
    noArrayIndent = false,
    skipInvalid = false,
    flowLevel = -1,
    styles = null,
    sortKeys = false,
    lineWidth = 80,
    noRefs = false,
    noCompatMode = false,
    condenseFlow = false
  }) {
    super(schema);
    this.indent = Math.max(1, indent2);
    this.noArrayIndent = noArrayIndent;
    this.skipInvalid = skipInvalid;
    this.flowLevel = flowLevel;
    this.styleMap = compileStyleMap(this.schema, styles);
    this.sortKeys = sortKeys;
    this.lineWidth = lineWidth;
    this.noRefs = noRefs;
    this.noCompatMode = noCompatMode;
    this.condenseFlow = condenseFlow;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
  }
};

// https://deno.land/std@0.168.0/encoding/_yaml/dumper/dumper.ts
var _toString3 = Object.prototype.toString;
var { hasOwn: hasOwn5 } = Object;
var CHAR_TAB = 9;
var CHAR_LINE_FEED = 10;
var CHAR_SPACE = 32;
var CHAR_EXCLAMATION = 33;
var CHAR_DOUBLE_QUOTE = 34;
var CHAR_SHARP = 35;
var CHAR_PERCENT = 37;
var CHAR_AMPERSAND = 38;
var CHAR_SINGLE_QUOTE = 39;
var CHAR_ASTERISK = 42;
var CHAR_COMMA = 44;
var CHAR_MINUS = 45;
var CHAR_COLON = 58;
var CHAR_GREATER_THAN = 62;
var CHAR_QUESTION = 63;
var CHAR_COMMERCIAL_AT = 64;
var CHAR_LEFT_SQUARE_BRACKET = 91;
var CHAR_RIGHT_SQUARE_BRACKET = 93;
var CHAR_GRAVE_ACCENT = 96;
var CHAR_LEFT_CURLY_BRACKET = 123;
var CHAR_VERTICAL_LINE = 124;
var CHAR_RIGHT_CURLY_BRACKET = 125;
var ESCAPE_SEQUENCES = {};
ESCAPE_SEQUENCES[0] = "\\0";
ESCAPE_SEQUENCES[7] = "\\a";
ESCAPE_SEQUENCES[8] = "\\b";
ESCAPE_SEQUENCES[9] = "\\t";
ESCAPE_SEQUENCES[10] = "\\n";
ESCAPE_SEQUENCES[11] = "\\v";
ESCAPE_SEQUENCES[12] = "\\f";
ESCAPE_SEQUENCES[13] = "\\r";
ESCAPE_SEQUENCES[27] = "\\e";
ESCAPE_SEQUENCES[34] = '\\"';
ESCAPE_SEQUENCES[92] = "\\\\";
ESCAPE_SEQUENCES[133] = "\\N";
ESCAPE_SEQUENCES[160] = "\\_";
ESCAPE_SEQUENCES[8232] = "\\L";
ESCAPE_SEQUENCES[8233] = "\\P";
var DEPRECATED_BOOLEANS_SYNTAX = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
];
function encodeHex(character) {
  const string = character.toString(16).toUpperCase();
  let handle;
  let length;
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new YAMLError(
      "code point within a string may not be greater than 0xFFFFFFFF"
    );
  }
  return `\\${handle}${repeat("0", length - string.length)}${string}`;
}
function indentString(string, spaces) {
  const ind = repeat(" ", spaces), length = string.length;
  let position = 0, next2 = -1, result = "", line;
  while (position < length) {
    next2 = string.indexOf("\n", position);
    if (next2 === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next2 + 1);
      position = next2 + 1;
    }
    if (line.length && line !== "\n")
      result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return `
${repeat(" ", state.indent * level)}`;
}
function testImplicitResolving(state, str2) {
  let type;
  for (let index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];
    if (type.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== 65279 || 65536 <= c && c <= 1114111;
}
function isPlainSafe(c) {
  return isPrintable(c) && c !== 65279 && // - c-flow-indicator
  c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && // - ":" - "#"
  c !== CHAR_COLON && c !== CHAR_SHARP;
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== 65279 && !isWhitespace(c) && // - s-white
  // - (c-indicator ::=
  // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
  c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
  c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && // | “%” | “@” | “`”)
  c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function needIndentIndicator(string) {
  const leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
var STYLE_PLAIN = 1;
var STYLE_SINGLE = 2;
var STYLE_LITERAL = 3;
var STYLE_FOLDED = 4;
var STYLE_DOUBLE = 5;
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
  const shouldTrackWidth = lineWidth !== -1;
  let hasLineBreak = false, hasFoldableLine = false, previousLineBreak = -1, plain = isPlainSafeFirst(string.charCodeAt(0)) && !isWhitespace(string.charCodeAt(string.length - 1));
  let char, i;
  if (singleLineOnly) {
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
  } else {
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
          i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
  }
  if (!hasLineBreak && !hasFoldableLine) {
    return plain && !testAmbiguousType(string) ? STYLE_PLAIN : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ")
    return line;
  const breakRe = / [^ ]/g;
  let match;
  let start = 0, end, curr = 0, next2 = 0;
  let result = "";
  while (match = breakRe.exec(line)) {
    next2 = match.index;
    if (next2 - start > width) {
      end = curr > start ? curr : next2;
      result += `
${line.slice(start, end)}`;
      start = end + 1;
    }
    curr = next2;
  }
  result += "\n";
  if (line.length - start > width && curr > start) {
    result += `${line.slice(start, curr)}
${line.slice(curr + 1)}`;
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function dropEndingNewline(string) {
  return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  const lineRe = /(\n+)([^\n]*)/g;
  let result = (() => {
    let nextLF = string.indexOf("\n");
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  })();
  let prevMoreIndented = string[0] === "\n" || string[0] === " ";
  let moreIndented;
  let match;
  while (match = lineRe.exec(string)) {
    const prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function escapeString(string) {
  let result = "";
  let char, nextChar;
  let escapeSeq;
  for (let i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    if (char >= 55296 && char <= 56319) {
      nextChar = string.charCodeAt(i + 1);
      if (nextChar >= 56320 && nextChar <= 57343) {
        result += encodeHex(
          (char - 55296) * 1024 + nextChar - 56320 + 65536
        );
        i++;
        continue;
      }
    }
    escapeSeq = ESCAPE_SEQUENCES[char];
    result += !escapeSeq && isPrintable(char) ? string[i] : escapeSeq || encodeHex(char);
  }
  return result;
}
function blockHeader(string, indentPerLevel) {
  const indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  const clip = string[string.length - 1] === "\n";
  const keep = clip && (string[string.length - 2] === "\n" || string === "\n");
  const chomp = keep ? "+" : clip ? "" : "-";
  return `${indentIndicator}${chomp}
`;
}
function writeScalar(state, string, level, iskey) {
  state.dump = (() => {
    if (string.length === 0) {
      return "''";
    }
    if (!state.noCompatMode && DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
      return `'${string}'`;
    }
    const indent2 = state.indent * Math.max(1, level);
    const lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent2);
    const singleLineOnly = iskey || // No block styles in flow mode.
    state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(str2) {
      return testImplicitResolving(state, str2);
    }
    switch (chooseScalarStyle(
      string,
      singleLineOnly,
      state.indent,
      lineWidth,
      testAmbiguity
    )) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return `'${string.replace(/'/g, "''")}'`;
      case STYLE_LITERAL:
        return `|${blockHeader(string, state.indent)}${dropEndingNewline(
          indentString(string, indent2)
        )}`;
      case STYLE_FOLDED:
        return `>${blockHeader(string, state.indent)}${dropEndingNewline(
          indentString(foldString(string, lineWidth), indent2)
        )}`;
      case STYLE_DOUBLE:
        return `"${escapeString(string)}"`;
      default:
        throw new YAMLError("impossible error: invalid scalar style");
    }
  })();
}
function writeFlowSequence(state, level, object) {
  let _result = "";
  const _tag = state.tag;
  for (let index = 0, length = object.length; index < length; index += 1) {
    if (writeNode(state, level, object[index], false, false)) {
      if (index !== 0)
        _result += `,${!state.condenseFlow ? " " : ""}`;
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = `[${_result}]`;
}
function writeBlockSequence(state, level, object, compact = false) {
  let _result = "";
  const _tag = state.tag;
  for (let index = 0, length = object.length; index < length; index += 1) {
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || index !== 0) {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  let _result = "";
  const _tag = state.tag, objectKeyList = Object.keys(object);
  let pairBuffer, objectKey, objectValue;
  for (let index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = state.condenseFlow ? '"' : "";
    if (index !== 0)
      pairBuffer += ", ";
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024)
      pairBuffer += "? ";
    pairBuffer += `${state.dump}${state.condenseFlow ? '"' : ""}:${state.condenseFlow ? "" : " "}`;
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = `{${_result}}`;
}
function writeBlockMapping(state, level, object, compact = false) {
  const _tag = state.tag, objectKeyList = Object.keys(object);
  let _result = "";
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new YAMLError("sortKeys must be a boolean or a function");
  }
  let pairBuffer = "", objectKey, objectValue, explicitPair;
  for (let index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = "";
    if (!compact || index !== 0) {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit = false) {
  const typeList = explicit ? state.explicitTypes : state.implicitTypes;
  let type;
  let style;
  let _result;
  for (let index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];
    if ((type.instanceOf || type.predicate) && (!type.instanceOf || typeof object === "object" && object instanceof type.instanceOf) && (!type.predicate || type.predicate(object))) {
      state.tag = explicit ? type.tag : "?";
      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;
        if (_toString3.call(type.represent) === "[object Function]") {
          _result = type.represent(object, style);
        } else if (hasOwn5(type.represent, style)) {
          _result = type.represent[style](
            object,
            style
          );
        } else {
          throw new YAMLError(
            `!<${type.tag}> tag resolver accepts not "${style}" style`
          );
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey = false) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  const type = _toString3.call(state.dump);
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  const objectOrArray = type === "[object Object]" || type === "[object Array]";
  let duplicateIndex = -1;
  let duplicate = false;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = `*ref_${duplicateIndex}`;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = `&ref_${duplicateIndex}${state.dump}`;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = `&ref_${duplicateIndex} ${state.dump}`;
        }
      }
    } else if (type === "[object Array]") {
      const arrayLevel = state.noArrayIndent && level > 0 ? level - 1 : level;
      if (block && state.dump.length !== 0) {
        writeBlockSequence(state, arrayLevel, state.dump, compact);
        if (duplicate) {
          state.dump = `&ref_${duplicateIndex}${state.dump}`;
        }
      } else {
        writeFlowSequence(state, arrayLevel, state.dump);
        if (duplicate) {
          state.dump = `&ref_${duplicateIndex} ${state.dump}`;
        }
      }
    } else if (type === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid)
        return false;
      throw new YAMLError(`unacceptable kind of an object to dump ${type}`);
    }
    if (state.tag !== null && state.tag !== "?") {
      state.dump = `!<${state.tag}> ${state.dump}`;
    }
  }
  return true;
}
function inspectNode(object, objects, duplicatesIndexes) {
  if (object !== null && typeof object === "object") {
    const index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (let idx = 0, length = object.length; idx < length; idx += 1) {
          inspectNode(object[idx], objects, duplicatesIndexes);
        }
      } else {
        const objectKeyList = Object.keys(object);
        for (let idx = 0, length = objectKeyList.length; idx < length; idx += 1) {
          inspectNode(object[objectKeyList[idx]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function getDuplicateReferences(object, state) {
  const objects = [], duplicatesIndexes = [];
  inspectNode(object, objects, duplicatesIndexes);
  const length = duplicatesIndexes.length;
  for (let index = 0; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = Array.from({ length });
}
function dump(input, options) {
  options = options || {};
  const state = new DumperState(options);
  if (!state.noRefs)
    getDuplicateReferences(input, state);
  if (writeNode(state, 0, input, true, true))
    return `${state.dump}
`;
  return "";
}

// https://deno.land/std@0.168.0/encoding/_yaml/stringify.ts
function stringify(obj, options) {
  return dump(obj, options);
}

// https://deno.land/x/good@1.7.1.1/flattened/is_sync_iterable.js
var isSyncIterable = function(value) {
  return value && typeof value[Symbol.iterator] === "function";
};

// https://deno.land/x/good@1.7.1.1/flattened/empty_iterator.js
var emptyIterator = /* @__PURE__ */ function* () {
}();

// https://deno.land/x/good@1.7.1.1/flattened/make_iterable.js
var makeIterable = (object) => {
  if (object == null) {
    return emptyIterator;
  }
  if (object[Symbol.iterator] instanceof Function || object[Symbol.asyncIterator] instanceof Function) {
    return object;
  }
  if (Object.getPrototypeOf(object).constructor == Object) {
    return Object.entries(object);
  }
  return emptyIterator;
};

// https://deno.land/x/good@1.7.1.1/flattened/iter.js
var iter = (object) => {
  const iterable = makeIterable(object);
  if (iterable[Symbol.asyncIterator]) {
    return iterable[Symbol.asyncIterator]();
  } else {
    return iterable[Symbol.iterator]();
  }
};

// https://deno.land/x/good@1.7.1.1/flattened/stop_symbol.js
var stop = Symbol.for("iterationStop");

// https://deno.land/x/good@1.7.1.1/flattened/next.js
var handleResult = ({ value, done }) => done ? stop : value;
var next = (object) => {
  if (object.next instanceof Function) {
    const result = object.next();
    if (result instanceof Promise) {
      return result.then(handleResult);
    } else {
      return handleResult(result);
    }
  } else {
    throw Error(`can't call next(object) on the following object as there is no object.next() method`, object);
  }
};

// https://deno.land/x/good@1.7.1.1/flattened/is_async_iterable.js
var isAsyncIterable = function(value) {
  return value && typeof value[Symbol.asyncIterator] === "function";
};

// https://deno.land/x/good@1.7.1.1/flattened/lazy_concat.js
function lazyConcat(...iterables) {
  iterables = iterables.map(makeIterable);
  let iterator;
  if (iterables.some(isAsyncIterable)) {
    iterator = async function* () {
      for (const each of iterables) {
        for await (const eachItem of each) {
          yield eachItem;
        }
      }
    }();
  } else {
    iterator = function* () {
      for (const each of iterables) {
        yield* each;
      }
    }();
  }
  if (iterables.every((each) => typeof each.length == "number" && each.length === each.length)) {
    let totalLength = 0;
    for (const each of iterables) {
      totalLength += each.length;
    }
    iterator.length = totalLength;
  }
  return iterator;
}

// https://deno.land/x/good@1.7.1.1/flattened/escape_regex_match.js
var reservedCharMap = {
  "&": "\\x26",
  "!": "\\x21",
  "#": "\\x23",
  "$": "\\$",
  "%": "\\x25",
  "*": "\\*",
  "+": "\\+",
  ",": "\\x2c",
  ".": "\\.",
  ":": "\\x3a",
  ";": "\\x3b",
  "<": "\\x3c",
  "=": "\\x3d",
  ">": "\\x3e",
  "?": "\\?",
  "@": "\\x40",
  "^": "\\^",
  "`": "\\x60",
  "~": "\\x7e",
  "(": "\\(",
  ")": "\\)",
  "[": "\\[",
  "]": "\\]",
  "{": "\\{",
  "}": "\\}",
  "/": "\\/",
  "-": "\\x2d",
  "\\": "\\\\",
  "|": "\\|"
};
var RX_REGEXP_ESCAPE = new RegExp(
  `[${Object.values(reservedCharMap).join("")}]`,
  "gu"
);
function escapeRegexMatch(str2) {
  return str2.replaceAll(
    RX_REGEXP_ESCAPE,
    (m) => reservedCharMap[m]
  );
}

// https://deno.land/x/good@1.7.1.1/flattened/zip.js
var zip = function* (...iterables) {
  iterables = iterables.map((each) => iter(each));
  while (true) {
    const nexts = iterables.map((each) => each.next());
    if (nexts.every((each) => each.done)) {
      break;
    }
    yield nexts.map((each) => each.value);
  }
};

// https://deno.land/x/good@1.7.1.1/flattened/indent.js
var indent = ({ string, by = "    ", noLead = false }) => (noLead ? "" : by) + string.replace(/\n/g, "\n" + by);

// https://deno.land/x/good@1.7.1.1/flattened/to_representation.js
var reprSymbol = Symbol.for("representation");
var denoInspectSymbol = Symbol.for("Deno.customInspect");
var toRepresentation = (item, { alreadySeen = /* @__PURE__ */ new Set() } = {}) => {
  const recursionWrapper = (item2) => {
    if (item2 instanceof Object) {
      if (alreadySeen.has(item2)) {
        return `[Self Reference]`;
      } else {
        alreadySeen.add(item2);
      }
    }
    let output;
    if (item2 === void 0) {
      output = "undefined";
    } else if (item2 === null) {
      output = "null";
    } else if (typeof item2 == "string") {
      output = JSON.stringify(item2);
    } else if (typeof item2 == "symbol") {
      if (!item2.description) {
        output = "Symbol()";
      } else {
        const globalVersion = Symbol.for(item2.description);
        if (globalVersion == item2) {
          output = `Symbol.for(${JSON.stringify(item2.description)})`;
        } else {
          output = `Symbol(${JSON.stringify(item2.description)})`;
        }
      }
    } else if (item2 instanceof Date) {
      output = `new Date(${item2.getTime()})`;
    } else if (item2 instanceof Array) {
      output = `[${item2.map((each) => recursionWrapper(each)).join(",")}]`;
    } else if (item2 instanceof Set) {
      output = `new Set(${[...item2].map((each) => recursionWrapper(each)).join(",")})`;
    } else if (item2 instanceof Object && item2.constructor == Object) {
      output = pureObjectRepr(item2);
    } else if (item2 instanceof Map) {
      let string = "new Map(";
      for (const [key, value] of item2.entries()) {
        const stringKey = recursionWrapper(key);
        const stringValue = recursionWrapper(value);
        if (!stringKey.match(/\n/g)) {
          string += `
  [${stringKey}, ${indent({ string: stringValue, by: "  ", noLead: true })}],`;
        } else {
          string += `
  [${indent({ string: stringKey, by: "  ", noLead: true })},
  ${indent({ string: stringValue, by: "    ", noLead: true })}],`;
        }
      }
      string += "\n)";
      output = string;
    } else {
      if (item2[reprSymbol] instanceof Function) {
        try {
          output = item2[reprSymbol]();
          return output;
        } catch (error) {
        }
      }
      if (item2[denoInspectSymbol] instanceof Function) {
        try {
          output = item2[denoInspectSymbol]();
          return output;
        } catch (error) {
        }
      }
      try {
        output = item2.toString();
        if (output !== "[object Object]") {
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && item2.prototype && typeof item2.name == "string") {
          output = `class ${item2.name} { /*...*/ }`;
          return output;
        }
      } catch (error) {
      }
      try {
        if (item2.constructor instanceof Function && typeof item2.constructor.name == "string") {
          output = `new ${item2.constructor.name}(${pureObjectRepr(item2)})`;
          return output;
        }
      } catch (error) {
      }
      return pureObjectRepr(item2);
    }
    return output;
  };
  const pureObjectRepr = (item2) => {
    let string = "{";
    for (const [key, value] of Object.entries(item2)) {
      const stringKey = recursionWrapper(key);
      const stringValue = recursionWrapper(value);
      string += `
  ${stringKey}: ${indent({ string: stringValue, by: "  ", noLead: true })},`;
    }
    string += "\n}";
    return string;
  };
  return recursionWrapper(item);
};

// https://deno.land/x/good@1.7.1.1/flattened/to_string.js
var toString = (value) => {
  if (typeof value == "symbol") {
    return toRepresentation(value);
  } else if (!(value instanceof Object)) {
    return value != null ? value.toString() : `${value}`;
  } else {
    return toRepresentation(value);
  }
};

// https://deno.land/x/good@1.7.1.1/flattened/regex.js
var regexpProxy = Symbol("regexpProxy");
var realExec = RegExp.prototype.exec;
RegExp.prototype.exec = function(...args) {
  if (this[regexpProxy]) {
    return realExec.apply(this[regexpProxy], args);
  }
  return realExec.apply(this, args);
};
var proxyRegExp;
var regexProxyOptions = Object.freeze({
  get(original, key) {
    if (typeof key == "string" && key.match(/^[igmusyv]+$/)) {
      return proxyRegExp(original, key);
    }
    if (key == regexpProxy) {
      return original;
    }
    return original[key];
  },
  set(original, key, value) {
    original[key] = value;
    return true;
  }
});
proxyRegExp = (parent, flags) => {
  const regex2 = new RegExp(parent, flags);
  const output = new Proxy(regex2, regexProxyOptions);
  Object.setPrototypeOf(output, Object.getPrototypeOf(regex2));
  return output;
};
function regexWithStripWarning(shouldStrip) {
  return (strings, ...values) => {
    let newRegexString = "";
    for (const [string, value] of zip(strings, values)) {
      newRegexString += string;
      if (value instanceof RegExp) {
        if (!shouldStrip && value.flags.replace(/g/, "").length > 0) {
          console.warn(`Warning: flags inside of regex:
    The RegExp trigging this warning is: ${value}
    When calling the regex interpolater (e.g. regex\`something\${stuff}\`)
    one of the \${} values (the one above) was a RegExp with a flag enabled
    e.g. /stuff/i  <- i = ignoreCase flag enabled
    When the /stuff/i gets interpolated, its going to loose its flags
    (thats what I'm warning you about)
    
    To disable/ignore this warning do:
        regex.stripFlags\`something\${/stuff/i}\`
    If you want to add flags to the output of regex\`something\${stuff}\` do:
        regex\`something\${stuff}\`.i   // ignoreCase
        regex\`something\${stuff}\`.ig  // ignoreCase and global
        regex\`something\${stuff}\`.gi  // functionally equivlent
`);
        }
        newRegexString += `(?:${value.source})`;
      } else if (value != null) {
        newRegexString += escapeRegexMatch(toString(value));
      }
    }
    return proxyRegExp(newRegexString, "");
  };
}
var regex = regexWithStripWarning(false);
regex.stripFlags = regexWithStripWarning(true);

// helpers.js
var ensureUniqueNames = (headers) => {
  const duplicateHeadersExist = new Set(headers).size !== headers.length;
  if (!duplicateHeadersExist) {
    return headers;
  }
  let incremental = [];
  for (const each of headers) {
    if (incremental.includes(each)) {
      let startNumber = 1;
      let nextAttempt = `${each}${startNumber}`;
      while (incremental.includes(nextAttempt)) {
        startNumber += 1;
        nextAttempt = `${each}${startNumber}`;
      }
      incremental.push(nextAttempt);
    } else {
      incremental.push(each);
    }
  }
  return incremental;
};
var rowify = (data, { defaultHeaders = [] } = {}) => {
  let rows = data;
  const headers = [...defaultHeaders];
  rows = [headers];
  for (const eachRow of data) {
    if (eachRow instanceof Array) {
      rows.push(eachRow);
    } else {
      for (const eachKey of Object.keys(eachRow)) {
        if (!headers.includes(eachKey)) {
          headers.push(eachKey);
        }
      }
      rows.push(
        headers.map((eachKey) => eachRow[eachKey])
      );
    }
  }
  for (const eachRow of rows) {
    while (eachRow.length < headers.length) {
      eachRow.push(null);
    }
  }
  return rows;
};

// normal_csv.js
var csvEscapeCell = (stringData, delimiter = ",") => {
  if (stringData.includes(delimiter) || stringData.includes("\n") || stringData.includes("\r") || stringData.includes('"')) {
    return stringData.replace(/\"/g, '""');
  } else {
    return stringData;
  }
};
function* csvParseIter(csvString, { delimiter = ",", warnings = true, commentSymbol = "", ...options } = {}) {
  let row = [];
  if (csvString.trim().length == 0) {
    throw Error(`Can't parse empty string`);
  }
  if (typeof delimiter != "string" || delimiter.length !== 1) {
    throw Error(`Delimiter must be a single character, instead got ${delimiter}`);
  }
  if (delimiter == "\n" || delimiter == "\r" || delimiter == '"') {
    throw Error(`Delimiter must not be a newline or quote character`);
  }
  let lineIndex = 0;
  const commentPattern = commentSymbol ? regex`^(${commentSymbol ?? ""}).*(\r\n|\n|\r|$)` : null;
  const simplePattern = regex`^([^"${delimiter}\n\r]*)(${delimiter}|\r\n|\n|\r|$)`;
  const quotePattern = regex`^[ \t]*"((?:[^"]|"")*)"[ \t]*(${delimiter}|\r\n|\n|\r|$)`;
  const borkedQuotePattern = regex`^([^${delimiter}\n\r]*)(${delimiter}|\r\n|\n|\r|$)`;
  let startingAtNewline = true;
  while (csvString.length > 0) {
    let isComment;
    let isQuote;
    let match;
    if (commentPattern && (match = csvString.match(commentPattern))) {
      isComment = true;
    } else if (match = csvString.match(simplePattern)) {
      isQuote = false;
    } else if (match = csvString.match(quotePattern)) {
      isQuote = true;
    } else if (match = csvString.match(borkedQuotePattern)) {
      isQuote = false;
      if (warnings) {
        console.warn(`Line ${lineIndex + 1} has a quote but isnt a quoted entry (broken quote). Parsing as-if not quoted, Use {warnings: false} option to disable this warning`);
      }
    }
    csvString = csvString.slice(match[0].length);
    if (!isComment) {
      const stringContent = isQuote ? match[1].replace(/""/g, '"') : match[1];
      row.push(stringContent);
    }
    startingAtNewline = !match[0].endsWith(",");
    if (startingAtNewline) {
      lineIndex += 1;
      yield row;
      row = [];
    }
  }
}

// main.js
var toTypedCsv = Symbol();
var w3schoolsIsoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
var extraIsoDateRegex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;
var simpleDateRegex = /^\d{4}-\d{1,2}-\d{1,2}($| |\t)/;
var matchesIso8601Date = (string) => string.match(w3schoolsIsoDateRegex) || string.match(extraIsoDateRegex);
var matchesReservedPattern = (string) => {
  return (
    // to allow computed items / equations
    string.startsWith("=") || // to allow regex (yeah yeah i know i know)
    string.startsWith("/") && string.match(/\/([igmusyv]*)$/) || // default comment symbol
    string.startsWith("#") || // to allow durations and times in the future
    string.match(/^\d+:/) || // to allow dates (no times) either YYYY-MM-DD and DD/MM/YYYY (probably only want to support YYYY-MM-DD, but will reserve both)
    string.match(simpleDateRegex) || string.match(/^\d{1,2}\/\d{1,2}\/\d{1,2}($| |\t)/) || // ISO date
    matchesIso8601Date(string)
  );
};
var parseCell = (each) => {
  const trimmed = each.trim();
  if (trimmed.length == 0) {
    return null;
  }
  if (trimmed.match(/^\.?nan$/i)) {
    return NaN;
  }
  if (trimmed.match(/^-?\.?(inf|infinity)$/i)) {
    if (trimmed.startsWith("-")) {
      return -Infinity;
    } else {
      return Infinity;
    }
  }
  if (trimmed.startsWith("/")) {
    let flags;
    if (flags = trimmed.match(/\/([igmusyv]*)$/)) {
      return new RegExp(trimmed.slice(1, -flags[0].length), flags[1]);
    }
  }
  if (each.match(simpleDateRegex) || matchesIso8601Date(each)) {
    return new Date(each);
  }
  try {
    return parse(each);
  } catch (error) {
    return each;
  }
};
function* parseIter(csvString, { delimiter = ",", warnings = true, asObjects = true, commentSymbol = "", ...options } = {}) {
  const iterable = iter(
    csvParseIter(csvString, { delimiter, ...options })
  );
  let headers = next(iterable);
  if (headers == stop) {
    throw Error(`When trying to parse a typed csv, there must be a header row and I didn't find one. String was: ${csvString}`);
  }
  headers = headers.map((each) => {
    const value = parseCell(each);
    if (typeof value != "string") {
      return each;
    } else {
      return value;
    }
  });
  const headersBefore = warnings ? JSON.stringify(headers) : null;
  headers = ensureUniqueNames(headers);
  if (warnings && headersBefore != JSON.stringify(headers)) {
    console.warn(`Warning: When trying to parse a typed csv, the columns names (headers) were not unique, and are required to be. I made it unique, but you may want to check the results. Original headers: ${headersBefore}, Unique headers: ${JSON.stringify(headers)}. Use the {warnings: false} option to disable this warning`);
  }
  yield headers;
  let longRowWarningSent = false;
  let rowIndex = -1;
  for (const row of iterable) {
    rowIndex += 1;
    if (row == stop) {
      break;
    }
    let cellIndex = -1;
    for (const each of row) {
      cellIndex += 1;
      row[cellIndex] = parseCell(each);
    }
    if (asObjects) {
      for (const [rowValue, headerName] of zip(row, headers)) {
        if (headerName == void 0) {
          if (!longRowWarningSent && warnings) {
            longRowWarningSent = true;
            console.warn(`Warning: When trying to parse a typed csv, row ${rowIndex + 1} was longer than the header row. These values will be ignored. Use the {warnings: false} option to disable this warning`);
          }
          continue;
        }
        row[headerName] = rowValue;
      }
    }
    yield row;
  }
}
var parse2 = (csvString, { delimiter = ",", warnings = true, outputForm = "rows", ...options } = {}) => {
  if (outputForm == "rows") {
    const iterable = iter(
      parseIter(csvString, { delimiter, warnings, ...options })
    );
    const headers = next(iterable);
    const rows = [...iterable];
    return { headers, rows };
  } else if (outputForm == "dataframe") {
    const iterable = iter(
      parseIter(csvString, { delimiter, warnings, asObjects: false, ...options })
    );
    const headers = next(iterable);
    const outputObject2 = Object.fromEntries(headers.map((each) => [each, []]));
    for (const row of iterable) {
      for (const [rowValue, headerName] of zip(row, headers)) {
        if (headerName == void 0) {
          continue;
        }
        outputObject2[headerName].push(rowValue);
      }
    }
  } else {
    throw new Error(`outputForm must be either "rows" or "dataframe". Instead I got: ${outputForm}`);
  }
  return outputObject;
};
var stringifyCell = (each, options = {}) => {
  if (each == void 0) {
    return "";
  }
  if (each == null) {
    if (options.nullAsEmpty) {
      return "";
    } else {
      return "null";
    }
  }
  if (each === "") {
    return '""';
  }
  if (each instanceof Date) {
    return each.toISOString();
  }
  if (each instanceof BigInt) {
    return each.toString();
  }
  if (each instanceof RegExp) {
    return each.toString();
  }
  if (each[toTypedCsv] instanceof Function) {
    return each[toTypedCsv](options);
  }
  if (typeof each != "string") {
    let newString = stringify(each, { collectionStyle: "flow", ...options.yamlOptions });
    if (newString[newString.length - 1] == "\n") {
      newString = newString.slice(0, -1);
    }
    return newString;
  }
  if (matchesReservedPattern(each)) {
    return JSON.stringify(each);
  }
  const asString = stringify(each);
  if ((asString.startsWith('"') || asString.startsWith("'")) && asString.endsWith("\n")) {
    return asString.slice(0, -1);
  } else {
    each = `${each}`;
    if (each.length + 1 == asString.length && asString.endsWith("\n") && !each.endsWith("\n")) {
      return asString.slice(0, -1);
    }
    return asString;
  }
};
var stringify2 = (data, { headers = [], delimiter = ",", ...options } = {}) => {
  if (!isSyncIterable(data)) {
    if (data instanceof Object) {
      const autoHeaders = Object.keys(data);
      if (autoHeaders.length === 0) {
        return ensureUniqueNames(headers).map((each) => csvEscapeCell(String(each))).join(delimiter) + "\n";
      } else {
        headers = autoHeaders.concat(headers);
      }
      const objectValues = Object.values(data);
      for (const [key, value] of Object.entries(data)) {
        if (!isSyncIterable(value)) {
          throw new Error(`data must be an synchnous iterable (array, set, generator, etc), or an object (Dataframe) of synchnous iterables. Instead I got a data frame where the ${JSON.stringify(key)} key was ${toRepresentation(data)}`);
        }
      }
      data = lazyConcat(headers, zip(...Object.values(data)));
    } else {
      throw new Error(`data must be an synchnous iterable (array, set, generator, etc), or an object (Dataframe) of synchnous iterables. Instead I got: ${toRepresentation(data)}`);
    }
  }
  const iterable = iter(data);
  const first = next(iterable);
  if (first == stop) {
    return ensureUniqueNames(headers).map((each) => csvEscapeCell(String(each))).join(delimiter) + "\n";
  }
  const assumeAllAreObjects = !isSyncIterable(first) && first instanceof Object;
  if (assumeAllAreObjects) {
    var [headers, ...data] = rowify(
      lazyConcat([first], data),
      {
        defaultHeaders: headers
      }
    );
  }
  return [...iterGenerateCsv(data, { headers, delimiter, ...options })].join("");
};
function* iterGenerateCsv(data, { headers = [], delimiter = ",", ...options } = {}) {
  if (!isSyncIterable(data)) {
    throw new Error(`data must be an synchnous iterable (array, set, generator, etc), instead I got: ${toRepresentation(data)}`);
  }
  yield ensureUniqueNames(headers).map((each) => csvEscapeCell(String(each))).join(delimiter) + "\n";
  for (const row of data) {
    yield [...row].map((each) => csvEscapeCell(stringifyCell(each, options))).join(delimiter) + "\n";
  }
}
export {
  parse2 as parse,
  parseCell,
  parseIter,
  stringify2 as stringify,
  stringifyCell,
  toTypedCsv
};
