/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 8090:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const internal_globber_1 = __nccwpck_require__(8298);
/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
function create(patterns, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield internal_globber_1.DefaultGlobber.create(patterns, options);
    });
}
exports.create = create;
//# sourceMappingURL=glob.js.map

/***/ }),

/***/ 1026:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
/**
 * Returns a copy with defaults filled in.
 */
function getOptions(copy) {
    const result = {
        followSymbolicLinks: true,
        implicitDescendants: true,
        omitBrokenSymbolicLinks: true
    };
    if (copy) {
        if (typeof copy.followSymbolicLinks === 'boolean') {
            result.followSymbolicLinks = copy.followSymbolicLinks;
            core.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
        }
        if (typeof copy.implicitDescendants === 'boolean') {
            result.implicitDescendants = copy.implicitDescendants;
            core.debug(`implicitDescendants '${result.implicitDescendants}'`);
        }
        if (typeof copy.omitBrokenSymbolicLinks === 'boolean') {
            result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
            core.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
        }
    }
    return result;
}
exports.getOptions = getOptions;
//# sourceMappingURL=internal-glob-options-helper.js.map

/***/ }),

/***/ 8298:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(5747));
const globOptionsHelper = __importStar(__nccwpck_require__(1026));
const path = __importStar(__nccwpck_require__(5622));
const patternHelper = __importStar(__nccwpck_require__(9005));
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_pattern_1 = __nccwpck_require__(4536);
const internal_search_state_1 = __nccwpck_require__(9117);
const IS_WINDOWS = process.platform === 'win32';
class DefaultGlobber {
    constructor(options) {
        this.patterns = [];
        this.searchPaths = [];
        this.options = globOptionsHelper.getOptions(options);
    }
    getSearchPaths() {
        // Return a copy
        return this.searchPaths.slice();
    }
    glob() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (var _b = __asyncValues(this.globGenerator()), _c; _c = yield _b.next(), !_c.done;) {
                    const itemPath = _c.value;
                    result.push(itemPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result;
        });
    }
    globGenerator() {
        return __asyncGenerator(this, arguments, function* globGenerator_1() {
            // Fill in defaults options
            const options = globOptionsHelper.getOptions(this.options);
            // Implicit descendants?
            const patterns = [];
            for (const pattern of this.patterns) {
                patterns.push(pattern);
                if (options.implicitDescendants &&
                    (pattern.trailingSeparator ||
                        pattern.segments[pattern.segments.length - 1] !== '**')) {
                    patterns.push(new internal_pattern_1.Pattern(pattern.negate, pattern.segments.concat('**')));
                }
            }
            // Push the search paths
            const stack = [];
            for (const searchPath of patternHelper.getSearchPaths(patterns)) {
                core.debug(`Search path '${searchPath}'`);
                // Exists?
                try {
                    // Intentionally using lstat. Detection for broken symlink
                    // will be performed later (if following symlinks).
                    yield __await(fs.promises.lstat(searchPath));
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        continue;
                    }
                    throw err;
                }
                stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
            }
            // Search
            const traversalChain = []; // used to detect cycles
            while (stack.length) {
                // Pop
                const item = stack.pop();
                // Match?
                const match = patternHelper.match(patterns, item.path);
                const partialMatch = !!match || patternHelper.partialMatch(patterns, item.path);
                if (!match && !partialMatch) {
                    continue;
                }
                // Stat
                const stats = yield __await(DefaultGlobber.stat(item, options, traversalChain)
                // Broken symlink, or symlink cycle detected, or no longer exists
                );
                // Broken symlink, or symlink cycle detected, or no longer exists
                if (!stats) {
                    continue;
                }
                // Directory
                if (stats.isDirectory()) {
                    // Matched
                    if (match & internal_match_kind_1.MatchKind.Directory) {
                        yield yield __await(item.path);
                    }
                    // Descend?
                    else if (!partialMatch) {
                        continue;
                    }
                    // Push the child items in reverse
                    const childLevel = item.level + 1;
                    const childItems = (yield __await(fs.promises.readdir(item.path))).map(x => new internal_search_state_1.SearchState(path.join(item.path, x), childLevel));
                    stack.push(...childItems.reverse());
                }
                // File
                else if (match & internal_match_kind_1.MatchKind.File) {
                    yield yield __await(item.path);
                }
            }
        });
    }
    /**
     * Constructs a DefaultGlobber
     */
    static create(patterns, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new DefaultGlobber(options);
            if (IS_WINDOWS) {
                patterns = patterns.replace(/\r\n/g, '\n');
                patterns = patterns.replace(/\r/g, '\n');
            }
            const lines = patterns.split('\n').map(x => x.trim());
            for (const line of lines) {
                // Empty or comment
                if (!line || line.startsWith('#')) {
                    continue;
                }
                // Pattern
                else {
                    result.patterns.push(new internal_pattern_1.Pattern(line));
                }
            }
            result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
            return result;
        });
    }
    static stat(item, options, traversalChain) {
        return __awaiter(this, void 0, void 0, function* () {
            // Note:
            // `stat` returns info about the target of a symlink (or symlink chain)
            // `lstat` returns info about a symlink itself
            let stats;
            if (options.followSymbolicLinks) {
                try {
                    // Use `stat` (following symlinks)
                    stats = yield fs.promises.stat(item.path);
                }
                catch (err) {
                    if (err.code === 'ENOENT') {
                        if (options.omitBrokenSymbolicLinks) {
                            core.debug(`Broken symlink '${item.path}'`);
                            return undefined;
                        }
                        throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
                    }
                    throw err;
                }
            }
            else {
                // Use `lstat` (not following symlinks)
                stats = yield fs.promises.lstat(item.path);
            }
            // Note, isDirectory() returns false for the lstat of a symlink
            if (stats.isDirectory() && options.followSymbolicLinks) {
                // Get the realpath
                const realPath = yield fs.promises.realpath(item.path);
                // Fixup the traversal chain to match the item level
                while (traversalChain.length >= item.level) {
                    traversalChain.pop();
                }
                // Test for a cycle
                if (traversalChain.some((x) => x === realPath)) {
                    core.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
                    return undefined;
                }
                // Update the traversal chain
                traversalChain.push(realPath);
            }
            return stats;
        });
    }
}
exports.DefaultGlobber = DefaultGlobber;
//# sourceMappingURL=internal-globber.js.map

/***/ }),

/***/ 1063:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Indicates whether a pattern matches a path
 */
var MatchKind;
(function (MatchKind) {
    /** Not matched */
    MatchKind[MatchKind["None"] = 0] = "None";
    /** Matched if the path is a directory */
    MatchKind[MatchKind["Directory"] = 1] = "Directory";
    /** Matched if the path is a regular file */
    MatchKind[MatchKind["File"] = 2] = "File";
    /** Matched */
    MatchKind[MatchKind["All"] = 3] = "All";
})(MatchKind = exports.MatchKind || (exports.MatchKind = {}));
//# sourceMappingURL=internal-match-kind.js.map

/***/ }),

/***/ 1849:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __importStar(__nccwpck_require__(5622));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
 *
 * For example, on Linux/macOS:
 * - `/               => /`
 * - `/hello          => /`
 *
 * For example, on Windows:
 * - `C:\             => C:\`
 * - `C:\hello        => C:\`
 * - `C:              => C:`
 * - `C:hello         => C:`
 * - `\               => \`
 * - `\hello          => \`
 * - `\\hello         => \\hello`
 * - `\\hello\world   => \\hello\world`
 */
function dirname(p) {
    // Normalize slashes and trim unnecessary trailing slash
    p = safeTrimTrailingSeparator(p);
    // Windows UNC root, e.g. \\hello or \\hello\world
    if (IS_WINDOWS && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) {
        return p;
    }
    // Get dirname
    let result = path.dirname(p);
    // Trim trailing slash for Windows UNC root, e.g. \\hello\world\
    if (IS_WINDOWS && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) {
        result = safeTrimTrailingSeparator(result);
    }
    return result;
}
exports.dirname = dirname;
/**
 * Roots the path if not already rooted. On Windows, relative roots like `\`
 * or `C:` are expanded based on the current working directory.
 */
function ensureAbsoluteRoot(root, itemPath) {
    assert_1.default(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
    assert_1.default(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Already rooted
    if (hasAbsoluteRoot(itemPath)) {
        return itemPath;
    }
    // Windows
    if (IS_WINDOWS) {
        // Check for itemPath like C: or C:foo
        if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
            let cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            // Drive letter matches cwd? Expand to cwd
            if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) {
                // Drive only, e.g. C:
                if (itemPath.length === 2) {
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}`;
                }
                // Drive + path, e.g. C:foo
                else {
                    if (!cwd.endsWith('\\')) {
                        cwd += '\\';
                    }
                    // Preserve specified drive letter case (upper or lower)
                    return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
                }
            }
            // Different drive
            else {
                return `${itemPath[0]}:\\${itemPath.substr(2)}`;
            }
        }
        // Check for itemPath like \ or \foo
        else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
            const cwd = process.cwd();
            assert_1.default(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
            return `${cwd[0]}:\\${itemPath.substr(1)}`;
        }
    }
    assert_1.default(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
    // Otherwise ensure root ends with a separator
    if (root.endsWith('/') || (IS_WINDOWS && root.endsWith('\\'))) {
        // Intentionally empty
    }
    else {
        // Append separator
        root += path.sep;
    }
    return root + itemPath;
}
exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\\hello\share` and `C:\hello` (and using alternate separator).
 */
function hasAbsoluteRoot(itemPath) {
    assert_1.default(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \\hello\share or C:\hello
        return itemPath.startsWith('\\\\') || /^[A-Z]:\\/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasAbsoluteRoot = hasAbsoluteRoot;
/**
 * On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
 * `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
 */
function hasRoot(itemPath) {
    assert_1.default(itemPath, `isRooted parameter 'itemPath' must not be empty`);
    // Normalize separators
    itemPath = normalizeSeparators(itemPath);
    // Windows
    if (IS_WINDOWS) {
        // E.g. \ or \hello or \\hello
        // E.g. C: or C:\hello
        return itemPath.startsWith('\\') || /^[A-Z]:/i.test(itemPath);
    }
    // E.g. /hello
    return itemPath.startsWith('/');
}
exports.hasRoot = hasRoot;
/**
 * Removes redundant slashes and converts `/` to `\` on Windows
 */
function normalizeSeparators(p) {
    p = p || '';
    // Windows
    if (IS_WINDOWS) {
        // Convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // Remove redundant slashes
        const isUnc = /^\\\\+[^\\]/.test(p); // e.g. \\hello
        return (isUnc ? '\\' : '') + p.replace(/\\\\+/g, '\\'); // preserve leading \\ for UNC
    }
    // Remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
exports.normalizeSeparators = normalizeSeparators;
/**
 * Normalizes the path separators and trims the trailing separator (when safe).
 * For example, `/foo/ => /foo` but `/ => /`
 */
function safeTrimTrailingSeparator(p) {
    // Short-circuit if empty
    if (!p) {
        return '';
    }
    // Normalize separators
    p = normalizeSeparators(p);
    // No trailing slash
    if (!p.endsWith(path.sep)) {
        return p;
    }
    // Check '/' on Linux/macOS and '\' on Windows
    if (p === path.sep) {
        return p;
    }
    // On Windows check if drive root. E.g. C:\
    if (IS_WINDOWS && /^[A-Z]:\\$/i.test(p)) {
        return p;
    }
    // Otherwise trim trailing slash
    return p.substr(0, p.length - 1);
}
exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
//# sourceMappingURL=internal-path-helper.js.map

/***/ }),

/***/ 6836:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __importStar(__nccwpck_require__(5622));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const IS_WINDOWS = process.platform === 'win32';
/**
 * Helper class for parsing paths into segments
 */
class Path {
    /**
     * Constructs a Path
     * @param itemPath Path or array of segments
     */
    constructor(itemPath) {
        this.segments = [];
        // String
        if (typeof itemPath === 'string') {
            assert_1.default(itemPath, `Parameter 'itemPath' must not be empty`);
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
            // Not rooted
            if (!pathHelper.hasRoot(itemPath)) {
                this.segments = itemPath.split(path.sep);
            }
            // Rooted
            else {
                // Add all segments, while not at the root
                let remaining = itemPath;
                let dir = pathHelper.dirname(remaining);
                while (dir !== remaining) {
                    // Add the segment
                    const basename = path.basename(remaining);
                    this.segments.unshift(basename);
                    // Truncate the last segment
                    remaining = dir;
                    dir = pathHelper.dirname(remaining);
                }
                // Remainder is the root
                this.segments.unshift(remaining);
            }
        }
        // Array
        else {
            // Must not be empty
            assert_1.default(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
            // Each segment
            for (let i = 0; i < itemPath.length; i++) {
                let segment = itemPath[i];
                // Must not be empty
                assert_1.default(segment, `Parameter 'itemPath' must not contain any empty segments`);
                // Normalize slashes
                segment = pathHelper.normalizeSeparators(itemPath[i]);
                // Root segment
                if (i === 0 && pathHelper.hasRoot(segment)) {
                    segment = pathHelper.safeTrimTrailingSeparator(segment);
                    assert_1.default(segment === pathHelper.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
                    this.segments.push(segment);
                }
                // All other segments
                else {
                    // Must not contain slash
                    assert_1.default(!segment.includes(path.sep), `Parameter 'itemPath' contains unexpected path separators`);
                    this.segments.push(segment);
                }
            }
        }
    }
    /**
     * Converts the path to it's string representation
     */
    toString() {
        // First segment
        let result = this.segments[0];
        // All others
        let skipSlash = result.endsWith(path.sep) || (IS_WINDOWS && /^[A-Z]:$/i.test(result));
        for (let i = 1; i < this.segments.length; i++) {
            if (skipSlash) {
                skipSlash = false;
            }
            else {
                result += path.sep;
            }
            result += this.segments[i];
        }
        return result;
    }
}
exports.Path = Path;
//# sourceMappingURL=internal-path.js.map

/***/ }),

/***/ 9005:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const pathHelper = __importStar(__nccwpck_require__(1849));
const internal_match_kind_1 = __nccwpck_require__(1063);
const IS_WINDOWS = process.platform === 'win32';
/**
 * Given an array of patterns, returns an array of paths to search.
 * Duplicates and paths under other included paths are filtered out.
 */
function getSearchPaths(patterns) {
    // Ignore negate patterns
    patterns = patterns.filter(x => !x.negate);
    // Create a map of all search paths
    const searchPathMap = {};
    for (const pattern of patterns) {
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        searchPathMap[key] = 'candidate';
    }
    const result = [];
    for (const pattern of patterns) {
        // Check if already included
        const key = IS_WINDOWS
            ? pattern.searchPath.toUpperCase()
            : pattern.searchPath;
        if (searchPathMap[key] === 'included') {
            continue;
        }
        // Check for an ancestor search path
        let foundAncestor = false;
        let tempKey = key;
        let parent = pathHelper.dirname(tempKey);
        while (parent !== tempKey) {
            if (searchPathMap[parent]) {
                foundAncestor = true;
                break;
            }
            tempKey = parent;
            parent = pathHelper.dirname(tempKey);
        }
        // Include the search pattern in the result
        if (!foundAncestor) {
            result.push(pattern.searchPath);
            searchPathMap[key] = 'included';
        }
    }
    return result;
}
exports.getSearchPaths = getSearchPaths;
/**
 * Matches the patterns against the path
 */
function match(patterns, itemPath) {
    let result = internal_match_kind_1.MatchKind.None;
    for (const pattern of patterns) {
        if (pattern.negate) {
            result &= ~pattern.match(itemPath);
        }
        else {
            result |= pattern.match(itemPath);
        }
    }
    return result;
}
exports.match = match;
/**
 * Checks whether to descend further into the directory
 */
function partialMatch(patterns, itemPath) {
    return patterns.some(x => !x.negate && x.partialMatch(itemPath));
}
exports.partialMatch = partialMatch;
//# sourceMappingURL=internal-pattern-helper.js.map

/***/ }),

/***/ 4536:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
const pathHelper = __importStar(__nccwpck_require__(1849));
const assert_1 = __importDefault(__nccwpck_require__(2357));
const minimatch_1 = __nccwpck_require__(3973);
const internal_match_kind_1 = __nccwpck_require__(1063);
const internal_path_1 = __nccwpck_require__(6836);
const IS_WINDOWS = process.platform === 'win32';
class Pattern {
    constructor(patternOrNegate, segments, homedir) {
        /**
         * Indicates whether matches should be excluded from the result set
         */
        this.negate = false;
        // Pattern overload
        let pattern;
        if (typeof patternOrNegate === 'string') {
            pattern = patternOrNegate.trim();
        }
        // Segments overload
        else {
            // Convert to pattern
            segments = segments || [];
            assert_1.default(segments.length, `Parameter 'segments' must not empty`);
            const root = Pattern.getLiteral(segments[0]);
            assert_1.default(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
            pattern = new internal_path_1.Path(segments).toString().trim();
            if (patternOrNegate) {
                pattern = `!${pattern}`;
            }
        }
        // Negate
        while (pattern.startsWith('!')) {
            this.negate = !this.negate;
            pattern = pattern.substr(1).trim();
        }
        // Normalize slashes and ensures absolute root
        pattern = Pattern.fixupPattern(pattern, homedir);
        // Segments
        this.segments = new internal_path_1.Path(pattern).segments;
        // Trailing slash indicates the pattern should only match directories, not regular files
        this.trailingSeparator = pathHelper
            .normalizeSeparators(pattern)
            .endsWith(path.sep);
        pattern = pathHelper.safeTrimTrailingSeparator(pattern);
        // Search path (literal path prior to the first glob segment)
        let foundGlob = false;
        const searchSegments = this.segments
            .map(x => Pattern.getLiteral(x))
            .filter(x => !foundGlob && !(foundGlob = x === ''));
        this.searchPath = new internal_path_1.Path(searchSegments).toString();
        // Root RegExp (required when determining partial match)
        this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS ? 'i' : '');
        // Create minimatch
        const minimatchOptions = {
            dot: true,
            nobrace: true,
            nocase: IS_WINDOWS,
            nocomment: true,
            noext: true,
            nonegate: true
        };
        pattern = IS_WINDOWS ? pattern.replace(/\\/g, '/') : pattern;
        this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
    }
    /**
     * Matches the pattern against the specified path
     */
    match(itemPath) {
        // Last segment is globstar?
        if (this.segments[this.segments.length - 1] === '**') {
            // Normalize slashes
            itemPath = pathHelper.normalizeSeparators(itemPath);
            // Append a trailing slash. Otherwise Minimatch will not match the directory immediately
            // preceding the globstar. For example, given the pattern `/foo/**`, Minimatch returns
            // false for `/foo` but returns true for `/foo/`. Append a trailing slash to handle that quirk.
            if (!itemPath.endsWith(path.sep)) {
                // Note, this is safe because the constructor ensures the pattern has an absolute root.
                // For example, formats like C: and C:foo on Windows are resolved to an absolute root.
                itemPath = `${itemPath}${path.sep}`;
            }
        }
        else {
            // Normalize slashes and trim unnecessary trailing slash
            itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        }
        // Match
        if (this.minimatch.match(itemPath)) {
            return this.trailingSeparator ? internal_match_kind_1.MatchKind.Directory : internal_match_kind_1.MatchKind.All;
        }
        return internal_match_kind_1.MatchKind.None;
    }
    /**
     * Indicates whether the pattern may match descendants of the specified path
     */
    partialMatch(itemPath) {
        // Normalize slashes and trim unnecessary trailing slash
        itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
        // matchOne does not handle root path correctly
        if (pathHelper.dirname(itemPath) === itemPath) {
            return this.rootRegExp.test(itemPath);
        }
        return this.minimatch.matchOne(itemPath.split(IS_WINDOWS ? /\\+/ : /\/+/), this.minimatch.set[0], true);
    }
    /**
     * Escapes glob patterns within a path
     */
    static globEscape(s) {
        return (IS_WINDOWS ? s : s.replace(/\\/g, '\\\\')) // escape '\' on Linux/macOS
            .replace(/(\[)(?=[^/]+\])/g, '[[]') // escape '[' when ']' follows within the path segment
            .replace(/\?/g, '[?]') // escape '?'
            .replace(/\*/g, '[*]'); // escape '*'
    }
    /**
     * Normalizes slashes and ensures absolute root
     */
    static fixupPattern(pattern, homedir) {
        // Empty
        assert_1.default(pattern, 'pattern cannot be empty');
        // Must not contain `.` segment, unless first segment
        // Must not contain `..` segment
        const literalSegments = new internal_path_1.Path(pattern).segments.map(x => Pattern.getLiteral(x));
        assert_1.default(literalSegments.every((x, i) => (x !== '.' || i === 0) && x !== '..'), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
        // Must not contain globs in root, e.g. Windows UNC path \\foo\b*r
        assert_1.default(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
        // Normalize slashes
        pattern = pathHelper.normalizeSeparators(pattern);
        // Replace leading `.` segment
        if (pattern === '.' || pattern.startsWith(`.${path.sep}`)) {
            pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
        }
        // Replace leading `~` segment
        else if (pattern === '~' || pattern.startsWith(`~${path.sep}`)) {
            homedir = homedir || os.homedir();
            assert_1.default(homedir, 'Unable to determine HOME directory');
            assert_1.default(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
            pattern = Pattern.globEscape(homedir) + pattern.substr(1);
        }
        // Replace relative drive root, e.g. pattern is C: or C:foo
        else if (IS_WINDOWS &&
            (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', pattern.substr(0, 2));
            if (pattern.length > 2 && !root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(2);
        }
        // Replace relative root, e.g. pattern is \ or \foo
        else if (IS_WINDOWS && (pattern === '\\' || pattern.match(/^\\[^\\]/))) {
            let root = pathHelper.ensureAbsoluteRoot('C:\\dummy-root', '\\');
            if (!root.endsWith('\\')) {
                root += '\\';
            }
            pattern = Pattern.globEscape(root) + pattern.substr(1);
        }
        // Otherwise ensure absolute root
        else {
            pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
        }
        return pathHelper.normalizeSeparators(pattern);
    }
    /**
     * Attempts to unescape a pattern segment to create a literal path segment.
     * Otherwise returns empty string.
     */
    static getLiteral(segment) {
        let literal = '';
        for (let i = 0; i < segment.length; i++) {
            const c = segment[i];
            // Escape
            if (c === '\\' && !IS_WINDOWS && i + 1 < segment.length) {
                literal += segment[++i];
                continue;
            }
            // Wildcard
            else if (c === '*' || c === '?') {
                return '';
            }
            // Character set
            else if (c === '[' && i + 1 < segment.length) {
                let set = '';
                let closed = -1;
                for (let i2 = i + 1; i2 < segment.length; i2++) {
                    const c2 = segment[i2];
                    // Escape
                    if (c2 === '\\' && !IS_WINDOWS && i2 + 1 < segment.length) {
                        set += segment[++i2];
                        continue;
                    }
                    // Closed
                    else if (c2 === ']') {
                        closed = i2;
                        break;
                    }
                    // Otherwise
                    else {
                        set += c2;
                    }
                }
                // Closed?
                if (closed >= 0) {
                    // Cannot convert
                    if (set.length > 1) {
                        return '';
                    }
                    // Convert to literal
                    if (set) {
                        literal += set;
                        i = closed;
                        continue;
                    }
                }
                // Otherwise fall thru
            }
            // Append
            literal += c;
        }
        return literal;
    }
    /**
     * Escapes regexp special characters
     * https://javascript.info/regexp-escaping
     */
    static regExpEscape(s) {
        return s.replace(/[[\\^$.|?*+()]/g, '\\$&');
    }
}
exports.Pattern = Pattern;
//# sourceMappingURL=internal-pattern.js.map

/***/ }),

/***/ 9117:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class SearchState {
    constructor(path, level) {
        this.path = path;
        this.level = level;
    }
}
exports.SearchState = SearchState;
//# sourceMappingURL=internal-search-state.js.map

/***/ }),

/***/ 3121:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This file is auto-generated, don't edit it
/**
 *
 */
const tea_util_1 = __importStar(__nccwpck_require__(1979)), $Util = tea_util_1;
const openapi_client_1 = __importStar(__nccwpck_require__(9892)), $OpenApi = openapi_client_1;
const openapi_util_1 = __importDefault(__nccwpck_require__(8190));
const endpoint_util_1 = __importDefault(__nccwpck_require__(2306));
const $tea = __importStar(__nccwpck_require__(4165));
class AddCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            ownerAccount: 'OwnerAccount',
            securityToken: 'SecurityToken',
            cdnType: 'CdnType',
            domainName: 'DomainName',
            resourceGroupId: 'ResourceGroupId',
            sources: 'Sources',
            checkUrl: 'CheckUrl',
            scope: 'Scope',
            topLevelDomain: 'TopLevelDomain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            ownerAccount: 'string',
            securityToken: 'string',
            cdnType: 'string',
            domainName: 'string',
            resourceGroupId: 'string',
            sources: 'string',
            checkUrl: 'string',
            scope: 'string',
            topLevelDomain: 'string',
        };
    }
}
exports.AddCdnDomainRequest = AddCdnDomainRequest;
class AddCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.AddCdnDomainResponseBody = AddCdnDomainResponseBody;
class AddCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: AddCdnDomainResponseBody,
        };
    }
}
exports.AddCdnDomainResponse = AddCdnDomainResponse;
class AddFCTriggerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            triggerARN: 'TriggerARN',
            eventMetaName: 'EventMetaName',
            eventMetaVersion: 'EventMetaVersion',
            sourceARN: 'SourceARN',
            functionARN: 'FunctionARN',
            roleARN: 'RoleARN',
            notes: 'Notes',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            triggerARN: 'string',
            eventMetaName: 'string',
            eventMetaVersion: 'string',
            sourceARN: 'string',
            functionARN: 'string',
            roleARN: 'string',
            notes: 'string',
        };
    }
}
exports.AddFCTriggerRequest = AddFCTriggerRequest;
class AddFCTriggerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.AddFCTriggerResponseBody = AddFCTriggerResponseBody;
class AddFCTriggerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: AddFCTriggerResponseBody,
        };
    }
}
exports.AddFCTriggerResponse = AddFCTriggerResponse;
class BatchAddCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            ownerAccount: 'OwnerAccount',
            securityToken: 'SecurityToken',
            cdnType: 'CdnType',
            domainName: 'DomainName',
            resourceGroupId: 'ResourceGroupId',
            sources: 'Sources',
            checkUrl: 'CheckUrl',
            scope: 'Scope',
            topLevelDomain: 'TopLevelDomain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            ownerAccount: 'string',
            securityToken: 'string',
            cdnType: 'string',
            domainName: 'string',
            resourceGroupId: 'string',
            sources: 'string',
            checkUrl: 'string',
            scope: 'string',
            topLevelDomain: 'string',
        };
    }
}
exports.BatchAddCdnDomainRequest = BatchAddCdnDomainRequest;
class BatchAddCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchAddCdnDomainResponseBody = BatchAddCdnDomainResponseBody;
class BatchAddCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchAddCdnDomainResponseBody,
        };
    }
}
exports.BatchAddCdnDomainResponse = BatchAddCdnDomainResponse;
class BatchSetCdnDomainConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            ownerAccount: 'OwnerAccount',
            securityToken: 'SecurityToken',
            domainNames: 'DomainNames',
            functions: 'Functions',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            ownerAccount: 'string',
            securityToken: 'string',
            domainNames: 'string',
            functions: 'string',
        };
    }
}
exports.BatchSetCdnDomainConfigRequest = BatchSetCdnDomainConfigRequest;
class BatchSetCdnDomainConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchSetCdnDomainConfigResponseBody = BatchSetCdnDomainConfigResponseBody;
class BatchSetCdnDomainConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchSetCdnDomainConfigResponseBody,
        };
    }
}
exports.BatchSetCdnDomainConfigResponse = BatchSetCdnDomainConfigResponse;
class BatchSetCdnDomainServerCertificateRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            certName: 'CertName',
            certType: 'CertType',
            SSLProtocol: 'SSLProtocol',
            SSLPub: 'SSLPub',
            SSLPri: 'SSLPri',
            region: 'Region',
            forceSet: 'ForceSet',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            certName: 'string',
            certType: 'string',
            SSLProtocol: 'string',
            SSLPub: 'string',
            SSLPri: 'string',
            region: 'string',
            forceSet: 'string',
        };
    }
}
exports.BatchSetCdnDomainServerCertificateRequest = BatchSetCdnDomainServerCertificateRequest;
class BatchSetCdnDomainServerCertificateResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchSetCdnDomainServerCertificateResponseBody = BatchSetCdnDomainServerCertificateResponseBody;
class BatchSetCdnDomainServerCertificateResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchSetCdnDomainServerCertificateResponseBody,
        };
    }
}
exports.BatchSetCdnDomainServerCertificateResponse = BatchSetCdnDomainServerCertificateResponse;
class BatchStartCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainNames: 'DomainNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainNames: 'string',
        };
    }
}
exports.BatchStartCdnDomainRequest = BatchStartCdnDomainRequest;
class BatchStartCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchStartCdnDomainResponseBody = BatchStartCdnDomainResponseBody;
class BatchStartCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchStartCdnDomainResponseBody,
        };
    }
}
exports.BatchStartCdnDomainResponse = BatchStartCdnDomainResponse;
class BatchStopCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainNames: 'DomainNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainNames: 'string',
        };
    }
}
exports.BatchStopCdnDomainRequest = BatchStopCdnDomainRequest;
class BatchStopCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchStopCdnDomainResponseBody = BatchStopCdnDomainResponseBody;
class BatchStopCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchStopCdnDomainResponseBody,
        };
    }
}
exports.BatchStopCdnDomainResponse = BatchStopCdnDomainResponse;
class BatchUpdateCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            sources: 'Sources',
            resourceGroupId: 'ResourceGroupId',
            topLevelDomain: 'TopLevelDomain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            sources: 'string',
            resourceGroupId: 'string',
            topLevelDomain: 'string',
        };
    }
}
exports.BatchUpdateCdnDomainRequest = BatchUpdateCdnDomainRequest;
class BatchUpdateCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.BatchUpdateCdnDomainResponseBody = BatchUpdateCdnDomainResponseBody;
class BatchUpdateCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: BatchUpdateCdnDomainResponseBody,
        };
    }
}
exports.BatchUpdateCdnDomainResponse = BatchUpdateCdnDomainResponse;
class CreateCdnCertificateSigningRequestRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            commonName: 'CommonName',
            SANs: 'SANs',
            organization: 'Organization',
            organizationUnit: 'OrganizationUnit',
            country: 'Country',
            state: 'State',
            city: 'City',
            email: 'Email',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            commonName: 'string',
            SANs: 'string',
            organization: 'string',
            organizationUnit: 'string',
            country: 'string',
            state: 'string',
            city: 'string',
            email: 'string',
        };
    }
}
exports.CreateCdnCertificateSigningRequestRequest = CreateCdnCertificateSigningRequestRequest;
class CreateCdnCertificateSigningRequestResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pubMd5: 'PubMd5',
            csr: 'Csr',
            requestId: 'RequestId',
            commonName: 'CommonName',
        };
    }
    static types() {
        return {
            pubMd5: 'string',
            csr: 'string',
            requestId: 'string',
            commonName: 'string',
        };
    }
}
exports.CreateCdnCertificateSigningRequestResponseBody = CreateCdnCertificateSigningRequestResponseBody;
class CreateCdnCertificateSigningRequestResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: CreateCdnCertificateSigningRequestResponseBody,
        };
    }
}
exports.CreateCdnCertificateSigningRequestResponse = CreateCdnCertificateSigningRequestResponse;
class CreateIllegalUrlExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            timePoint: 'TimePoint',
            taskName: 'TaskName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            timePoint: 'string',
            taskName: 'string',
        };
    }
}
exports.CreateIllegalUrlExportTaskRequest = CreateIllegalUrlExportTaskRequest;
class CreateIllegalUrlExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            taskId: 'TaskId',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            taskId: 'string',
            requestId: 'string',
        };
    }
}
exports.CreateIllegalUrlExportTaskResponseBody = CreateIllegalUrlExportTaskResponseBody;
class CreateIllegalUrlExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: CreateIllegalUrlExportTaskResponseBody,
        };
    }
}
exports.CreateIllegalUrlExportTaskResponse = CreateIllegalUrlExportTaskResponse;
class CreateRealTimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            project: 'Project',
            logstore: 'Logstore',
            region: 'Region',
            domain: 'Domain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            project: 'string',
            logstore: 'string',
            region: 'string',
            domain: 'string',
        };
    }
}
exports.CreateRealTimeLogDeliveryRequest = CreateRealTimeLogDeliveryRequest;
class CreateRealTimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.CreateRealTimeLogDeliveryResponseBody = CreateRealTimeLogDeliveryResponseBody;
class CreateRealTimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: CreateRealTimeLogDeliveryResponseBody,
        };
    }
}
exports.CreateRealTimeLogDeliveryResponse = CreateRealTimeLogDeliveryResponse;
class CreateUsageDetailDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
            group: 'Group',
            domainNames: 'DomainNames',
            type: 'Type',
            taskName: 'TaskName',
            language: 'Language',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
            group: 'string',
            domainNames: 'string',
            type: 'string',
            taskName: 'string',
            language: 'string',
        };
    }
}
exports.CreateUsageDetailDataExportTaskRequest = CreateUsageDetailDataExportTaskRequest;
class CreateUsageDetailDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            taskId: 'TaskId',
            endTime: 'EndTime',
            requestId: 'RequestId',
            startTime: 'StartTime',
        };
    }
    static types() {
        return {
            taskId: 'string',
            endTime: 'string',
            requestId: 'string',
            startTime: 'string',
        };
    }
}
exports.CreateUsageDetailDataExportTaskResponseBody = CreateUsageDetailDataExportTaskResponseBody;
class CreateUsageDetailDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: CreateUsageDetailDataExportTaskResponseBody,
        };
    }
}
exports.CreateUsageDetailDataExportTaskResponse = CreateUsageDetailDataExportTaskResponse;
class CreateUserUsageDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
            taskName: 'TaskName',
            language: 'Language',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
            taskName: 'string',
            language: 'string',
        };
    }
}
exports.CreateUserUsageDataExportTaskRequest = CreateUserUsageDataExportTaskRequest;
class CreateUserUsageDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            taskId: 'TaskId',
            endTime: 'EndTime',
            requestId: 'RequestId',
            startTime: 'StartTime',
        };
    }
    static types() {
        return {
            taskId: 'string',
            endTime: 'string',
            requestId: 'string',
            startTime: 'string',
        };
    }
}
exports.CreateUserUsageDataExportTaskResponseBody = CreateUserUsageDataExportTaskResponseBody;
class CreateUserUsageDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: CreateUserUsageDataExportTaskResponseBody,
        };
    }
}
exports.CreateUserUsageDataExportTaskResponse = CreateUserUsageDataExportTaskResponse;
class DeleteCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            ownerAccount: 'OwnerAccount',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            ownerAccount: 'string',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.DeleteCdnDomainRequest = DeleteCdnDomainRequest;
class DeleteCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteCdnDomainResponseBody = DeleteCdnDomainResponseBody;
class DeleteCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteCdnDomainResponseBody,
        };
    }
}
exports.DeleteCdnDomainResponse = DeleteCdnDomainResponse;
class DeleteFCTriggerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            triggerARN: 'TriggerARN',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            triggerARN: 'string',
        };
    }
}
exports.DeleteFCTriggerRequest = DeleteFCTriggerRequest;
class DeleteFCTriggerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteFCTriggerResponseBody = DeleteFCTriggerResponseBody;
class DeleteFCTriggerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteFCTriggerResponseBody,
        };
    }
}
exports.DeleteFCTriggerResponse = DeleteFCTriggerResponse;
class DeleteRealtimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domain: 'Domain',
            project: 'Project',
            logstore: 'Logstore',
            region: 'Region',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domain: 'string',
            project: 'string',
            logstore: 'string',
            region: 'string',
        };
    }
}
exports.DeleteRealtimeLogDeliveryRequest = DeleteRealtimeLogDeliveryRequest;
class DeleteRealtimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteRealtimeLogDeliveryResponseBody = DeleteRealtimeLogDeliveryResponseBody;
class DeleteRealtimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteRealtimeLogDeliveryResponseBody,
        };
    }
}
exports.DeleteRealtimeLogDeliveryResponse = DeleteRealtimeLogDeliveryResponse;
class DeleteSpecificConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            configId: 'string',
        };
    }
}
exports.DeleteSpecificConfigRequest = DeleteSpecificConfigRequest;
class DeleteSpecificConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteSpecificConfigResponseBody = DeleteSpecificConfigResponseBody;
class DeleteSpecificConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteSpecificConfigResponseBody,
        };
    }
}
exports.DeleteSpecificConfigResponse = DeleteSpecificConfigResponse;
class DeleteSpecificStagingConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            configId: 'string',
        };
    }
}
exports.DeleteSpecificStagingConfigRequest = DeleteSpecificStagingConfigRequest;
class DeleteSpecificStagingConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteSpecificStagingConfigResponseBody = DeleteSpecificStagingConfigResponseBody;
class DeleteSpecificStagingConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteSpecificStagingConfigResponseBody,
        };
    }
}
exports.DeleteSpecificStagingConfigResponse = DeleteSpecificStagingConfigResponse;
class DeleteUsageDetailDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            taskId: 'string',
        };
    }
}
exports.DeleteUsageDetailDataExportTaskRequest = DeleteUsageDetailDataExportTaskRequest;
class DeleteUsageDetailDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteUsageDetailDataExportTaskResponseBody = DeleteUsageDetailDataExportTaskResponseBody;
class DeleteUsageDetailDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteUsageDetailDataExportTaskResponseBody,
        };
    }
}
exports.DeleteUsageDetailDataExportTaskResponse = DeleteUsageDetailDataExportTaskResponse;
class DeleteUserUsageDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            taskId: 'string',
        };
    }
}
exports.DeleteUserUsageDataExportTaskRequest = DeleteUserUsageDataExportTaskRequest;
class DeleteUserUsageDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DeleteUserUsageDataExportTaskResponseBody = DeleteUserUsageDataExportTaskResponseBody;
class DeleteUserUsageDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DeleteUserUsageDataExportTaskResponseBody,
        };
    }
}
exports.DeleteUserUsageDataExportTaskResponse = DeleteUserUsageDataExportTaskResponse;
class DescribeActiveVersionOfConfigGroupRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            configGroupId: 'ConfigGroupId',
            env: 'Env',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            configGroupId: 'string',
            env: 'string',
        };
    }
}
exports.DescribeActiveVersionOfConfigGroupRequest = DescribeActiveVersionOfConfigGroupRequest;
class DescribeActiveVersionOfConfigGroupResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            versionId: 'VersionId',
            operator: 'Operator',
            configGroupId: 'ConfigGroupId',
            baseVersionId: 'BaseVersionId',
            description: 'Description',
            requestId: 'RequestId',
            createTime: 'CreateTime',
            updateTime: 'UpdateTime',
            seqId: 'SeqId',
        };
    }
    static types() {
        return {
            status: 'string',
            versionId: 'string',
            operator: 'string',
            configGroupId: 'string',
            baseVersionId: 'string',
            description: 'string',
            requestId: 'string',
            createTime: 'string',
            updateTime: 'string',
            seqId: 'number',
        };
    }
}
exports.DescribeActiveVersionOfConfigGroupResponseBody = DescribeActiveVersionOfConfigGroupResponseBody;
class DescribeActiveVersionOfConfigGroupResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeActiveVersionOfConfigGroupResponseBody,
        };
    }
}
exports.DescribeActiveVersionOfConfigGroupResponse = DescribeActiveVersionOfConfigGroupResponse;
class DescribeCdnCertificateDetailRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            certName: 'CertName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            certName: 'string',
        };
    }
}
exports.DescribeCdnCertificateDetailRequest = DescribeCdnCertificateDetailRequest;
class DescribeCdnCertificateDetailResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            certId: 'CertId',
            certName: 'CertName',
            cert: 'Cert',
            key: 'Key',
        };
    }
    static types() {
        return {
            requestId: 'string',
            certId: 'number',
            certName: 'string',
            cert: 'string',
            key: 'string',
        };
    }
}
exports.DescribeCdnCertificateDetailResponseBody = DescribeCdnCertificateDetailResponseBody;
class DescribeCdnCertificateDetailResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnCertificateDetailResponseBody,
        };
    }
}
exports.DescribeCdnCertificateDetailResponse = DescribeCdnCertificateDetailResponse;
class DescribeCdnCertificateListRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeCdnCertificateListRequest = DescribeCdnCertificateListRequest;
class DescribeCdnCertificateListResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            certificateListModel: 'CertificateListModel',
        };
    }
    static types() {
        return {
            requestId: 'string',
            certificateListModel: DescribeCdnCertificateListResponseBodyCertificateListModel,
        };
    }
}
exports.DescribeCdnCertificateListResponseBody = DescribeCdnCertificateListResponseBody;
class DescribeCdnCertificateListResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnCertificateListResponseBody,
        };
    }
}
exports.DescribeCdnCertificateListResponse = DescribeCdnCertificateListResponse;
class DescribeCdnDomainByCertificateRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            SSLPub: 'SSLPub',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            SSLPub: 'string',
        };
    }
}
exports.DescribeCdnDomainByCertificateRequest = DescribeCdnDomainByCertificateRequest;
class DescribeCdnDomainByCertificateResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfos: 'CertInfos',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            certInfos: DescribeCdnDomainByCertificateResponseBodyCertInfos,
            requestId: 'string',
        };
    }
}
exports.DescribeCdnDomainByCertificateResponseBody = DescribeCdnDomainByCertificateResponseBody;
class DescribeCdnDomainByCertificateResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnDomainByCertificateResponseBody,
        };
    }
}
exports.DescribeCdnDomainByCertificateResponse = DescribeCdnDomainByCertificateResponse;
class DescribeCdnDomainConfigsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            functionNames: 'FunctionNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            functionNames: 'string',
        };
    }
}
exports.DescribeCdnDomainConfigsRequest = DescribeCdnDomainConfigsRequest;
class DescribeCdnDomainConfigsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainConfigs: 'DomainConfigs',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainConfigs: DescribeCdnDomainConfigsResponseBodyDomainConfigs,
        };
    }
}
exports.DescribeCdnDomainConfigsResponseBody = DescribeCdnDomainConfigsResponseBody;
class DescribeCdnDomainConfigsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnDomainConfigsResponseBody,
        };
    }
}
exports.DescribeCdnDomainConfigsResponse = DescribeCdnDomainConfigsResponse;
class DescribeCdnDomainDetailRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeCdnDomainDetailRequest = DescribeCdnDomainDetailRequest;
class DescribeCdnDomainDetailResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            getDomainDetailModel: 'GetDomainDetailModel',
        };
    }
    static types() {
        return {
            requestId: 'string',
            getDomainDetailModel: DescribeCdnDomainDetailResponseBodyGetDomainDetailModel,
        };
    }
}
exports.DescribeCdnDomainDetailResponseBody = DescribeCdnDomainDetailResponseBody;
class DescribeCdnDomainDetailResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnDomainDetailResponseBody,
        };
    }
}
exports.DescribeCdnDomainDetailResponse = DescribeCdnDomainDetailResponse;
class DescribeCdnDomainLogsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            pageSize: 'number',
            pageNumber: 'number',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeCdnDomainLogsRequest = DescribeCdnDomainLogsRequest;
class DescribeCdnDomainLogsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainLogDetails: 'DomainLogDetails',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainLogDetails: DescribeCdnDomainLogsResponseBodyDomainLogDetails,
        };
    }
}
exports.DescribeCdnDomainLogsResponseBody = DescribeCdnDomainLogsResponseBody;
class DescribeCdnDomainLogsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnDomainLogsResponseBody,
        };
    }
}
exports.DescribeCdnDomainLogsResponse = DescribeCdnDomainLogsResponse;
class DescribeCdnDomainStagingConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            functionNames: 'FunctionNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            functionNames: 'string',
        };
    }
}
exports.DescribeCdnDomainStagingConfigRequest = DescribeCdnDomainStagingConfigRequest;
class DescribeCdnDomainStagingConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainConfigs: 'DomainConfigs',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainConfigs: { 'type': 'array', 'itemType': DescribeCdnDomainStagingConfigResponseBodyDomainConfigs },
        };
    }
}
exports.DescribeCdnDomainStagingConfigResponseBody = DescribeCdnDomainStagingConfigResponseBody;
class DescribeCdnDomainStagingConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnDomainStagingConfigResponseBody,
        };
    }
}
exports.DescribeCdnDomainStagingConfigResponse = DescribeCdnDomainStagingConfigResponse;
class DescribeCdnHttpsDomainListRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            pageNumber: 'PageNumber',
            pageSize: 'PageSize',
            keyword: 'Keyword',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            pageNumber: 'number',
            pageSize: 'number',
            keyword: 'string',
        };
    }
}
exports.DescribeCdnHttpsDomainListRequest = DescribeCdnHttpsDomainListRequest;
class DescribeCdnHttpsDomainListResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfos: 'CertInfos',
            totalCount: 'TotalCount',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            certInfos: DescribeCdnHttpsDomainListResponseBodyCertInfos,
            totalCount: 'number',
            requestId: 'string',
        };
    }
}
exports.DescribeCdnHttpsDomainListResponseBody = DescribeCdnHttpsDomainListResponseBody;
class DescribeCdnHttpsDomainListResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnHttpsDomainListResponseBody,
        };
    }
}
exports.DescribeCdnHttpsDomainListResponse = DescribeCdnHttpsDomainListResponse;
class DescribeCdnRegionAndIspRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
        };
    }
}
exports.DescribeCdnRegionAndIspRequest = DescribeCdnRegionAndIspRequest;
class DescribeCdnRegionAndIspResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            regions: 'Regions',
            isps: 'Isps',
        };
    }
    static types() {
        return {
            requestId: 'string',
            regions: DescribeCdnRegionAndIspResponseBodyRegions,
            isps: DescribeCdnRegionAndIspResponseBodyIsps,
        };
    }
}
exports.DescribeCdnRegionAndIspResponseBody = DescribeCdnRegionAndIspResponseBody;
class DescribeCdnRegionAndIspResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnRegionAndIspResponseBody,
        };
    }
}
exports.DescribeCdnRegionAndIspResponse = DescribeCdnRegionAndIspResponse;
class DescribeCdnServiceRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
        };
    }
}
exports.DescribeCdnServiceRequest = DescribeCdnServiceRequest;
class DescribeCdnServiceResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            changingChargeType: 'ChangingChargeType',
            requestId: 'RequestId',
            instanceId: 'InstanceId',
            openingTime: 'OpeningTime',
            changingAffectTime: 'ChangingAffectTime',
            operationLocks: 'OperationLocks',
            internetChargeType: 'InternetChargeType',
        };
    }
    static types() {
        return {
            changingChargeType: 'string',
            requestId: 'string',
            instanceId: 'string',
            openingTime: 'string',
            changingAffectTime: 'string',
            operationLocks: DescribeCdnServiceResponseBodyOperationLocks,
            internetChargeType: 'string',
        };
    }
}
exports.DescribeCdnServiceResponseBody = DescribeCdnServiceResponseBody;
class DescribeCdnServiceResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnServiceResponseBody,
        };
    }
}
exports.DescribeCdnServiceResponse = DescribeCdnServiceResponse;
class DescribeCdnUserBillHistoryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeCdnUserBillHistoryRequest = DescribeCdnUserBillHistoryRequest;
class DescribeCdnUserBillHistoryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            billHistoryData: 'BillHistoryData',
        };
    }
    static types() {
        return {
            requestId: 'string',
            billHistoryData: DescribeCdnUserBillHistoryResponseBodyBillHistoryData,
        };
    }
}
exports.DescribeCdnUserBillHistoryResponseBody = DescribeCdnUserBillHistoryResponseBody;
class DescribeCdnUserBillHistoryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserBillHistoryResponseBody,
        };
    }
}
exports.DescribeCdnUserBillHistoryResponse = DescribeCdnUserBillHistoryResponse;
class DescribeCdnUserBillPredictionRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            dimension: 'Dimension',
            area: 'Area',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            dimension: 'string',
            area: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeCdnUserBillPredictionRequest = DescribeCdnUserBillPredictionRequest;
class DescribeCdnUserBillPredictionResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billType: 'BillType',
            endTime: 'EndTime',
            requestId: 'RequestId',
            startTime: 'StartTime',
            billPredictionData: 'BillPredictionData',
        };
    }
    static types() {
        return {
            billType: 'string',
            endTime: 'string',
            requestId: 'string',
            startTime: 'string',
            billPredictionData: DescribeCdnUserBillPredictionResponseBodyBillPredictionData,
        };
    }
}
exports.DescribeCdnUserBillPredictionResponseBody = DescribeCdnUserBillPredictionResponseBody;
class DescribeCdnUserBillPredictionResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserBillPredictionResponseBody,
        };
    }
}
exports.DescribeCdnUserBillPredictionResponse = DescribeCdnUserBillPredictionResponse;
class DescribeCdnUserBillTypeRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeCdnUserBillTypeRequest = DescribeCdnUserBillTypeRequest;
class DescribeCdnUserBillTypeResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            billTypeData: 'BillTypeData',
        };
    }
    static types() {
        return {
            requestId: 'string',
            billTypeData: DescribeCdnUserBillTypeResponseBodyBillTypeData,
        };
    }
}
exports.DescribeCdnUserBillTypeResponseBody = DescribeCdnUserBillTypeResponseBody;
class DescribeCdnUserBillTypeResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserBillTypeResponseBody,
        };
    }
}
exports.DescribeCdnUserBillTypeResponse = DescribeCdnUserBillTypeResponse;
class DescribeCdnUserConfigsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            functionName: 'FunctionName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            functionName: 'string',
        };
    }
}
exports.DescribeCdnUserConfigsRequest = DescribeCdnUserConfigsRequest;
class DescribeCdnUserConfigsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            configs: 'Configs',
        };
    }
    static types() {
        return {
            requestId: 'string',
            configs: { 'type': 'array', 'itemType': DescribeCdnUserConfigsResponseBodyConfigs },
        };
    }
}
exports.DescribeCdnUserConfigsResponseBody = DescribeCdnUserConfigsResponseBody;
class DescribeCdnUserConfigsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserConfigsResponseBody,
        };
    }
}
exports.DescribeCdnUserConfigsResponse = DescribeCdnUserConfigsResponse;
class DescribeCdnUserDomainsByFuncRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            funcId: 'FuncId',
            pageNumber: 'PageNumber',
            pageSize: 'PageSize',
            resourceGroupId: 'ResourceGroupId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            funcId: 'number',
            pageNumber: 'number',
            pageSize: 'number',
            resourceGroupId: 'string',
        };
    }
}
exports.DescribeCdnUserDomainsByFuncRequest = DescribeCdnUserDomainsByFuncRequest;
class DescribeCdnUserDomainsByFuncResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domains: 'Domains',
            totalCount: 'TotalCount',
            requestId: 'RequestId',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            domains: DescribeCdnUserDomainsByFuncResponseBodyDomains,
            totalCount: 'number',
            requestId: 'string',
            pageSize: 'number',
            pageNumber: 'number',
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponseBody = DescribeCdnUserDomainsByFuncResponseBody;
class DescribeCdnUserDomainsByFuncResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserDomainsByFuncResponseBody,
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponse = DescribeCdnUserDomainsByFuncResponse;
class DescribeCdnUserQuotaRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
        };
    }
}
exports.DescribeCdnUserQuotaRequest = DescribeCdnUserQuotaRequest;
class DescribeCdnUserQuotaResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            refreshUrlQuota: 'RefreshUrlQuota',
            blockRemain: 'BlockRemain',
            preloadRemain: 'PreloadRemain',
            refreshDirRemain: 'RefreshDirRemain',
            blockQuota: 'BlockQuota',
            refreshDirQuota: 'RefreshDirQuota',
            domainQuota: 'DomainQuota',
            refreshUrlRemain: 'RefreshUrlRemain',
            preloadQuota: 'PreloadQuota',
        };
    }
    static types() {
        return {
            requestId: 'string',
            refreshUrlQuota: 'number',
            blockRemain: 'number',
            preloadRemain: 'number',
            refreshDirRemain: 'number',
            blockQuota: 'number',
            refreshDirQuota: 'number',
            domainQuota: 'number',
            refreshUrlRemain: 'number',
            preloadQuota: 'number',
        };
    }
}
exports.DescribeCdnUserQuotaResponseBody = DescribeCdnUserQuotaResponseBody;
class DescribeCdnUserQuotaResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserQuotaResponseBody,
        };
    }
}
exports.DescribeCdnUserQuotaResponse = DescribeCdnUserQuotaResponse;
class DescribeCdnUserResourcePackageRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
        };
    }
}
exports.DescribeCdnUserResourcePackageRequest = DescribeCdnUserResourcePackageRequest;
class DescribeCdnUserResourcePackageResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            resourcePackageInfos: 'ResourcePackageInfos',
        };
    }
    static types() {
        return {
            requestId: 'string',
            resourcePackageInfos: DescribeCdnUserResourcePackageResponseBodyResourcePackageInfos,
        };
    }
}
exports.DescribeCdnUserResourcePackageResponseBody = DescribeCdnUserResourcePackageResponseBody;
class DescribeCdnUserResourcePackageResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnUserResourcePackageResponseBody,
        };
    }
}
exports.DescribeCdnUserResourcePackageResponse = DescribeCdnUserResourcePackageResponse;
class DescribeCdnWafDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            regionId: 'RegionId',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            regionId: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeCdnWafDomainRequest = DescribeCdnWafDomainRequest;
class DescribeCdnWafDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalCount: 'TotalCount',
            requestId: 'RequestId',
            outPutDomains: 'OutPutDomains',
        };
    }
    static types() {
        return {
            totalCount: 'number',
            requestId: 'string',
            outPutDomains: { 'type': 'array', 'itemType': DescribeCdnWafDomainResponseBodyOutPutDomains },
        };
    }
}
exports.DescribeCdnWafDomainResponseBody = DescribeCdnWafDomainResponseBody;
class DescribeCdnWafDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCdnWafDomainResponseBody,
        };
    }
}
exports.DescribeCdnWafDomainResponse = DescribeCdnWafDomainResponse;
class DescribeCertificateInfoByIDRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            certId: 'CertId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            certId: 'string',
        };
    }
}
exports.DescribeCertificateInfoByIDRequest = DescribeCertificateInfoByIDRequest;
class DescribeCertificateInfoByIDResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfos: 'CertInfos',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            certInfos: DescribeCertificateInfoByIDResponseBodyCertInfos,
            requestId: 'string',
        };
    }
}
exports.DescribeCertificateInfoByIDResponseBody = DescribeCertificateInfoByIDResponseBody;
class DescribeCertificateInfoByIDResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCertificateInfoByIDResponseBody,
        };
    }
}
exports.DescribeCertificateInfoByIDResponse = DescribeCertificateInfoByIDResponse;
class DescribeConfigOfVersionRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            versionId: 'VersionId',
            functionId: 'FunctionId',
            functionName: 'FunctionName',
            groupId: 'GroupId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            versionId: 'string',
            functionId: 'number',
            functionName: 'string',
            groupId: 'number',
        };
    }
}
exports.DescribeConfigOfVersionRequest = DescribeConfigOfVersionRequest;
class DescribeConfigOfVersionResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            versionConfigs: 'VersionConfigs',
        };
    }
    static types() {
        return {
            requestId: 'string',
            versionConfigs: DescribeConfigOfVersionResponseBodyVersionConfigs,
        };
    }
}
exports.DescribeConfigOfVersionResponseBody = DescribeConfigOfVersionResponseBody;
class DescribeConfigOfVersionResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeConfigOfVersionResponseBody,
        };
    }
}
exports.DescribeConfigOfVersionResponse = DescribeConfigOfVersionResponse;
class DescribeCustomLogConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            configId: 'string',
        };
    }
}
exports.DescribeCustomLogConfigRequest = DescribeCustomLogConfigRequest;
class DescribeCustomLogConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            sample: 'Sample',
            tag: 'Tag',
            remark: 'Remark',
        };
    }
    static types() {
        return {
            requestId: 'string',
            sample: 'string',
            tag: 'string',
            remark: 'string',
        };
    }
}
exports.DescribeCustomLogConfigResponseBody = DescribeCustomLogConfigResponseBody;
class DescribeCustomLogConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeCustomLogConfigResponseBody,
        };
    }
}
exports.DescribeCustomLogConfigResponse = DescribeCustomLogConfigResponse;
class DescribeDomainAverageResponseTimeRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            timeMerge: 'TimeMerge',
            domainType: 'DomainType',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            timeMerge: 'string',
            domainType: 'string',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainAverageResponseTimeRequest = DescribeDomainAverageResponseTimeRequest;
class DescribeDomainAverageResponseTimeResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            avgRTPerInterval: 'AvgRTPerInterval',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            avgRTPerInterval: DescribeDomainAverageResponseTimeResponseBodyAvgRTPerInterval,
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainAverageResponseTimeResponseBody = DescribeDomainAverageResponseTimeResponseBody;
class DescribeDomainAverageResponseTimeResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainAverageResponseTimeResponseBody,
        };
    }
}
exports.DescribeDomainAverageResponseTimeResponse = DescribeDomainAverageResponseTimeResponse;
class DescribeDomainBpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainBpsDataRequest = DescribeDomainBpsDataRequest;
class DescribeDomainBpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ispNameEn: 'IspNameEn',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            locationNameEn: 'LocationNameEn',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            bpsDataPerInterval: 'BpsDataPerInterval',
        };
    }
    static types() {
        return {
            ispNameEn: 'string',
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            locationNameEn: 'string',
            startTime: 'string',
            dataInterval: 'string',
            bpsDataPerInterval: DescribeDomainBpsDataResponseBodyBpsDataPerInterval,
        };
    }
}
exports.DescribeDomainBpsDataResponseBody = DescribeDomainBpsDataResponseBody;
class DescribeDomainBpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainBpsDataResponseBody,
        };
    }
}
exports.DescribeDomainBpsDataResponse = DescribeDomainBpsDataResponse;
class DescribeDomainBpsDataByLayerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            layer: 'Layer',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            layer: 'string',
        };
    }
}
exports.DescribeDomainBpsDataByLayerRequest = DescribeDomainBpsDataByLayerRequest;
class DescribeDomainBpsDataByLayerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            dataInterval: 'DataInterval',
            bpsDataInterval: 'BpsDataInterval',
        };
    }
    static types() {
        return {
            requestId: 'string',
            dataInterval: 'string',
            bpsDataInterval: DescribeDomainBpsDataByLayerResponseBodyBpsDataInterval,
        };
    }
}
exports.DescribeDomainBpsDataByLayerResponseBody = DescribeDomainBpsDataByLayerResponseBody;
class DescribeDomainBpsDataByLayerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainBpsDataByLayerResponseBody,
        };
    }
}
exports.DescribeDomainBpsDataByLayerResponse = DescribeDomainBpsDataByLayerResponse;
class DescribeDomainBpsDataByTimeStampRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            timePoint: 'TimePoint',
            ispNames: 'IspNames',
            locationNames: 'LocationNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            timePoint: 'string',
            ispNames: 'string',
            locationNames: 'string',
        };
    }
}
exports.DescribeDomainBpsDataByTimeStampRequest = DescribeDomainBpsDataByTimeStampRequest;
class DescribeDomainBpsDataByTimeStampResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            bpsDataList: 'BpsDataList',
            requestId: 'RequestId',
            domainName: 'DomainName',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            bpsDataList: DescribeDomainBpsDataByTimeStampResponseBodyBpsDataList,
            requestId: 'string',
            domainName: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainBpsDataByTimeStampResponseBody = DescribeDomainBpsDataByTimeStampResponseBody;
class DescribeDomainBpsDataByTimeStampResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainBpsDataByTimeStampResponseBody,
        };
    }
}
exports.DescribeDomainBpsDataByTimeStampResponse = DescribeDomainBpsDataByTimeStampResponse;
class DescribeDomainCcActivityLogRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            triggerObject: 'TriggerObject',
            value: 'Value',
            ruleName: 'RuleName',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            triggerObject: 'string',
            value: 'string',
            ruleName: 'string',
            pageSize: 'number',
            pageNumber: 'number',
        };
    }
}
exports.DescribeDomainCcActivityLogRequest = DescribeDomainCcActivityLogRequest;
class DescribeDomainCcActivityLogResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            pageSize: 'PageSize',
            total: 'Total',
            activityLog: 'ActivityLog',
            pageIndex: 'PageIndex',
        };
    }
    static types() {
        return {
            requestId: 'string',
            pageSize: 'number',
            total: 'number',
            activityLog: { 'type': 'array', 'itemType': DescribeDomainCcActivityLogResponseBodyActivityLog },
            pageIndex: 'number',
        };
    }
}
exports.DescribeDomainCcActivityLogResponseBody = DescribeDomainCcActivityLogResponseBody;
class DescribeDomainCcActivityLogResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainCcActivityLogResponseBody,
        };
    }
}
exports.DescribeDomainCcActivityLogResponse = DescribeDomainCcActivityLogResponse;
class DescribeDomainCertificateInfoRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
        };
    }
}
exports.DescribeDomainCertificateInfoRequest = DescribeDomainCertificateInfoRequest;
class DescribeDomainCertificateInfoResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfos: 'CertInfos',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            certInfos: DescribeDomainCertificateInfoResponseBodyCertInfos,
            requestId: 'string',
        };
    }
}
exports.DescribeDomainCertificateInfoResponseBody = DescribeDomainCertificateInfoResponseBody;
class DescribeDomainCertificateInfoResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainCertificateInfoResponseBody,
        };
    }
}
exports.DescribeDomainCertificateInfoResponse = DescribeDomainCertificateInfoResponse;
class DescribeDomainCustomLogConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
        };
    }
}
exports.DescribeDomainCustomLogConfigRequest = DescribeDomainCustomLogConfigRequest;
class DescribeDomainCustomLogConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            sample: 'Sample',
            configId: 'ConfigId',
            tag: 'Tag',
            remark: 'Remark',
        };
    }
    static types() {
        return {
            requestId: 'string',
            sample: 'string',
            configId: 'string',
            tag: 'string',
            remark: 'string',
        };
    }
}
exports.DescribeDomainCustomLogConfigResponseBody = DescribeDomainCustomLogConfigResponseBody;
class DescribeDomainCustomLogConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainCustomLogConfigResponseBody,
        };
    }
}
exports.DescribeDomainCustomLogConfigResponse = DescribeDomainCustomLogConfigResponse;
class DescribeDomainDetailDataByLayerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            field: 'Field',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            layer: 'Layer',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            field: 'string',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            layer: 'string',
        };
    }
}
exports.DescribeDomainDetailDataByLayerRequest = DescribeDomainDetailDataByLayerRequest;
class DescribeDomainDetailDataByLayerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: DescribeDomainDetailDataByLayerResponseBodyData,
        };
    }
}
exports.DescribeDomainDetailDataByLayerResponseBody = DescribeDomainDetailDataByLayerResponseBody;
class DescribeDomainDetailDataByLayerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainDetailDataByLayerResponseBody,
        };
    }
}
exports.DescribeDomainDetailDataByLayerResponse = DescribeDomainDetailDataByLayerResponse;
class DescribeDomainFileSizeProportionDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainFileSizeProportionDataRequest = DescribeDomainFileSizeProportionDataRequest;
class DescribeDomainFileSizeProportionDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            fileSizeProportionDataInterval: 'FileSizeProportionDataInterval',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            fileSizeProportionDataInterval: DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataInterval,
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponseBody = DescribeDomainFileSizeProportionDataResponseBody;
class DescribeDomainFileSizeProportionDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainFileSizeProportionDataResponseBody,
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponse = DescribeDomainFileSizeProportionDataResponse;
class DescribeDomainHitRateDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainHitRateDataRequest = DescribeDomainHitRateDataRequest;
class DescribeDomainHitRateDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            hitRateInterval: 'HitRateInterval',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            hitRateInterval: DescribeDomainHitRateDataResponseBodyHitRateInterval,
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainHitRateDataResponseBody = DescribeDomainHitRateDataResponseBody;
class DescribeDomainHitRateDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainHitRateDataResponseBody,
        };
    }
}
exports.DescribeDomainHitRateDataResponse = DescribeDomainHitRateDataResponse;
class DescribeDomainHttpCodeDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainHttpCodeDataRequest = DescribeDomainHttpCodeDataRequest;
class DescribeDomainHttpCodeDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            httpCodeData: 'HttpCodeData',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            httpCodeData: DescribeDomainHttpCodeDataResponseBodyHttpCodeData,
        };
    }
}
exports.DescribeDomainHttpCodeDataResponseBody = DescribeDomainHttpCodeDataResponseBody;
class DescribeDomainHttpCodeDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainHttpCodeDataResponseBody,
        };
    }
}
exports.DescribeDomainHttpCodeDataResponse = DescribeDomainHttpCodeDataResponse;
class DescribeDomainHttpCodeDataByLayerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            layer: 'Layer',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            layer: 'string',
        };
    }
}
exports.DescribeDomainHttpCodeDataByLayerRequest = DescribeDomainHttpCodeDataByLayerRequest;
class DescribeDomainHttpCodeDataByLayerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            dataInterval: 'DataInterval',
            httpCodeDataInterval: 'HttpCodeDataInterval',
        };
    }
    static types() {
        return {
            requestId: 'string',
            dataInterval: 'string',
            httpCodeDataInterval: DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataInterval,
        };
    }
}
exports.DescribeDomainHttpCodeDataByLayerResponseBody = DescribeDomainHttpCodeDataByLayerResponseBody;
class DescribeDomainHttpCodeDataByLayerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainHttpCodeDataByLayerResponseBody,
        };
    }
}
exports.DescribeDomainHttpCodeDataByLayerResponse = DescribeDomainHttpCodeDataByLayerResponse;
class DescribeDomainISPDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainISPDataRequest = DescribeDomainISPDataRequest;
class DescribeDomainISPDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            value: 'Value',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            value: DescribeDomainISPDataResponseBodyValue,
        };
    }
}
exports.DescribeDomainISPDataResponseBody = DescribeDomainISPDataResponseBody;
class DescribeDomainISPDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainISPDataResponseBody,
        };
    }
}
exports.DescribeDomainISPDataResponse = DescribeDomainISPDataResponse;
class DescribeDomainMax95BpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            timePoint: 'TimePoint',
            cycle: 'Cycle',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            timePoint: 'string',
            cycle: 'string',
        };
    }
}
exports.DescribeDomainMax95BpsDataRequest = DescribeDomainMax95BpsDataRequest;
class DescribeDomainMax95BpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            domesticMax95Bps: 'DomesticMax95Bps',
            max95Bps: 'Max95Bps',
            overseasMax95Bps: 'OverseasMax95Bps',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            domesticMax95Bps: 'string',
            max95Bps: 'string',
            overseasMax95Bps: 'string',
        };
    }
}
exports.DescribeDomainMax95BpsDataResponseBody = DescribeDomainMax95BpsDataResponseBody;
class DescribeDomainMax95BpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainMax95BpsDataResponseBody,
        };
    }
}
exports.DescribeDomainMax95BpsDataResponse = DescribeDomainMax95BpsDataResponse;
class DescribeDomainNamesOfVersionRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            versionId: 'VersionId',
            pageIndex: 'PageIndex',
            pageSize: 'PageSize',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            versionId: 'string',
            pageIndex: 'number',
            pageSize: 'string',
        };
    }
}
exports.DescribeDomainNamesOfVersionRequest = DescribeDomainNamesOfVersionRequest;
class DescribeDomainNamesOfVersionResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalCount: 'TotalCount',
            contents: 'Contents',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            totalCount: 'number',
            contents: { 'type': 'array', 'itemType': DescribeDomainNamesOfVersionResponseBodyContents },
            requestId: 'string',
        };
    }
}
exports.DescribeDomainNamesOfVersionResponseBody = DescribeDomainNamesOfVersionResponseBody;
class DescribeDomainNamesOfVersionResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainNamesOfVersionResponseBody,
        };
    }
}
exports.DescribeDomainNamesOfVersionResponse = DescribeDomainNamesOfVersionResponse;
class DescribeDomainPathDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            pageNumber: 'PageNumber',
            pageSize: 'PageSize',
            path: 'Path',
            startTime: 'StartTime',
            endTime: 'EndTime',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            pageNumber: 'number',
            pageSize: 'number',
            path: 'string',
            startTime: 'string',
            endTime: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeDomainPathDataRequest = DescribeDomainPathDataRequest;
class DescribeDomainPathDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalCount: 'TotalCount',
            endTime: 'EndTime',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
            domainName: 'DomainName',
            pathDataPerInterval: 'PathDataPerInterval',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            totalCount: 'number',
            endTime: 'string',
            pageSize: 'number',
            pageNumber: 'number',
            domainName: 'string',
            pathDataPerInterval: DescribeDomainPathDataResponseBodyPathDataPerInterval,
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainPathDataResponseBody = DescribeDomainPathDataResponseBody;
class DescribeDomainPathDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainPathDataResponseBody,
        };
    }
}
exports.DescribeDomainPathDataResponse = DescribeDomainPathDataResponse;
class DescribeDomainPvDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainPvDataRequest = DescribeDomainPvDataRequest;
class DescribeDomainPvDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            pvDataInterval: 'PvDataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            pvDataInterval: DescribeDomainPvDataResponseBodyPvDataInterval,
        };
    }
}
exports.DescribeDomainPvDataResponseBody = DescribeDomainPvDataResponseBody;
class DescribeDomainPvDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainPvDataResponseBody,
        };
    }
}
exports.DescribeDomainPvDataResponse = DescribeDomainPvDataResponse;
class DescribeDomainQpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainQpsDataRequest = DescribeDomainQpsDataRequest;
class DescribeDomainQpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            qpsDataInterval: 'QpsDataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            qpsDataInterval: DescribeDomainQpsDataResponseBodyQpsDataInterval,
        };
    }
}
exports.DescribeDomainQpsDataResponseBody = DescribeDomainQpsDataResponseBody;
class DescribeDomainQpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainQpsDataResponseBody,
        };
    }
}
exports.DescribeDomainQpsDataResponse = DescribeDomainQpsDataResponse;
class DescribeDomainQpsDataByLayerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            layer: 'Layer',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            layer: 'string',
        };
    }
}
exports.DescribeDomainQpsDataByLayerRequest = DescribeDomainQpsDataByLayerRequest;
class DescribeDomainQpsDataByLayerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            qpsDataInterval: 'QpsDataInterval',
            layer: 'Layer',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            qpsDataInterval: DescribeDomainQpsDataByLayerResponseBodyQpsDataInterval,
            layer: 'string',
        };
    }
}
exports.DescribeDomainQpsDataByLayerResponseBody = DescribeDomainQpsDataByLayerResponseBody;
class DescribeDomainQpsDataByLayerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainQpsDataByLayerResponseBody,
        };
    }
}
exports.DescribeDomainQpsDataByLayerResponse = DescribeDomainQpsDataByLayerResponse;
class DescribeDomainRealTimeBpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeBpsDataRequest = DescribeDomainRealTimeBpsDataRequest;
class DescribeDomainRealTimeBpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: DescribeDomainRealTimeBpsDataResponseBodyData,
        };
    }
}
exports.DescribeDomainRealTimeBpsDataResponseBody = DescribeDomainRealTimeBpsDataResponseBody;
class DescribeDomainRealTimeBpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeBpsDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeBpsDataResponse = DescribeDomainRealTimeBpsDataResponse;
class DescribeDomainRealTimeByteHitRateDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeByteHitRateDataRequest = DescribeDomainRealTimeByteHitRateDataRequest;
class DescribeDomainRealTimeByteHitRateDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: DescribeDomainRealTimeByteHitRateDataResponseBodyData,
        };
    }
}
exports.DescribeDomainRealTimeByteHitRateDataResponseBody = DescribeDomainRealTimeByteHitRateDataResponseBody;
class DescribeDomainRealTimeByteHitRateDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeByteHitRateDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeByteHitRateDataResponse = DescribeDomainRealTimeByteHitRateDataResponse;
class DescribeDomainRealTimeDetailDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            field: 'Field',
            locationNameEn: 'LocationNameEn',
            ispNameEn: 'IspNameEn',
            merge: 'Merge',
            mergeLocIsp: 'MergeLocIsp',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            field: 'string',
            locationNameEn: 'string',
            ispNameEn: 'string',
            merge: 'string',
            mergeLocIsp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeDetailDataRequest = DescribeDomainRealTimeDetailDataRequest;
class DescribeDomainRealTimeDetailDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: 'string',
        };
    }
}
exports.DescribeDomainRealTimeDetailDataResponseBody = DescribeDomainRealTimeDetailDataResponseBody;
class DescribeDomainRealTimeDetailDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeDetailDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeDetailDataResponse = DescribeDomainRealTimeDetailDataResponse;
class DescribeDomainRealTimeHttpCodeDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataRequest = DescribeDomainRealTimeHttpCodeDataRequest;
class DescribeDomainRealTimeHttpCodeDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            realTimeHttpCodeData: 'RealTimeHttpCodeData',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            realTimeHttpCodeData: DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeData,
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponseBody = DescribeDomainRealTimeHttpCodeDataResponseBody;
class DescribeDomainRealTimeHttpCodeDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeHttpCodeDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponse = DescribeDomainRealTimeHttpCodeDataResponse;
class DescribeDomainRealtimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domain: 'Domain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domain: 'string',
        };
    }
}
exports.DescribeDomainRealtimeLogDeliveryRequest = DescribeDomainRealtimeLogDeliveryRequest;
class DescribeDomainRealtimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            project: 'Project',
            requestId: 'RequestId',
            logstore: 'Logstore',
            region: 'Region',
        };
    }
    static types() {
        return {
            status: 'string',
            project: 'string',
            requestId: 'string',
            logstore: 'string',
            region: 'string',
        };
    }
}
exports.DescribeDomainRealtimeLogDeliveryResponseBody = DescribeDomainRealtimeLogDeliveryResponseBody;
class DescribeDomainRealtimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealtimeLogDeliveryResponseBody,
        };
    }
}
exports.DescribeDomainRealtimeLogDeliveryResponse = DescribeDomainRealtimeLogDeliveryResponse;
class DescribeDomainRealTimeQpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeQpsDataRequest = DescribeDomainRealTimeQpsDataRequest;
class DescribeDomainRealTimeQpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: DescribeDomainRealTimeQpsDataResponseBodyData,
        };
    }
}
exports.DescribeDomainRealTimeQpsDataResponseBody = DescribeDomainRealTimeQpsDataResponseBody;
class DescribeDomainRealTimeQpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeQpsDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeQpsDataResponse = DescribeDomainRealTimeQpsDataResponse;
class DescribeDomainRealTimeReqHitRateDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeReqHitRateDataRequest = DescribeDomainRealTimeReqHitRateDataRequest;
class DescribeDomainRealTimeReqHitRateDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            data: 'Data',
        };
    }
    static types() {
        return {
            requestId: 'string',
            data: DescribeDomainRealTimeReqHitRateDataResponseBodyData,
        };
    }
}
exports.DescribeDomainRealTimeReqHitRateDataResponseBody = DescribeDomainRealTimeReqHitRateDataResponseBody;
class DescribeDomainRealTimeReqHitRateDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeReqHitRateDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeReqHitRateDataResponse = DescribeDomainRealTimeReqHitRateDataResponse;
class DescribeDomainRealTimeSrcBpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcBpsDataRequest = DescribeDomainRealTimeSrcBpsDataRequest;
class DescribeDomainRealTimeSrcBpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            realTimeSrcBpsDataPerInterval: 'RealTimeSrcBpsDataPerInterval',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            realTimeSrcBpsDataPerInterval: DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerInterval,
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcBpsDataResponseBody = DescribeDomainRealTimeSrcBpsDataResponseBody;
class DescribeDomainRealTimeSrcBpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeSrcBpsDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeSrcBpsDataResponse = DescribeDomainRealTimeSrcBpsDataResponse;
class DescribeDomainRealTimeSrcHttpCodeDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataRequest = DescribeDomainRealTimeSrcHttpCodeDataRequest;
class DescribeDomainRealTimeSrcHttpCodeDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            realTimeSrcHttpCodeData: 'RealTimeSrcHttpCodeData',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            realTimeSrcHttpCodeData: DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeData,
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponseBody = DescribeDomainRealTimeSrcHttpCodeDataResponseBody;
class DescribeDomainRealTimeSrcHttpCodeDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeSrcHttpCodeDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponse = DescribeDomainRealTimeSrcHttpCodeDataResponse;
class DescribeDomainRealTimeSrcTrafficDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcTrafficDataRequest = DescribeDomainRealTimeSrcTrafficDataRequest;
class DescribeDomainRealTimeSrcTrafficDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            realTimeSrcTrafficDataPerInterval: 'RealTimeSrcTrafficDataPerInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            realTimeSrcTrafficDataPerInterval: DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerInterval,
        };
    }
}
exports.DescribeDomainRealTimeSrcTrafficDataResponseBody = DescribeDomainRealTimeSrcTrafficDataResponseBody;
class DescribeDomainRealTimeSrcTrafficDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeSrcTrafficDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeSrcTrafficDataResponse = DescribeDomainRealTimeSrcTrafficDataResponse;
class DescribeDomainRealTimeTrafficDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRealTimeTrafficDataRequest = DescribeDomainRealTimeTrafficDataRequest;
class DescribeDomainRealTimeTrafficDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            realTimeTrafficDataPerInterval: 'RealTimeTrafficDataPerInterval',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            realTimeTrafficDataPerInterval: DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerInterval,
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainRealTimeTrafficDataResponseBody = DescribeDomainRealTimeTrafficDataResponseBody;
class DescribeDomainRealTimeTrafficDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRealTimeTrafficDataResponseBody,
        };
    }
}
exports.DescribeDomainRealTimeTrafficDataResponse = DescribeDomainRealTimeTrafficDataResponse;
class DescribeDomainRegionDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainRegionDataRequest = DescribeDomainRegionDataRequest;
class DescribeDomainRegionDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            value: 'Value',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            value: DescribeDomainRegionDataResponseBodyValue,
        };
    }
}
exports.DescribeDomainRegionDataResponseBody = DescribeDomainRegionDataResponseBody;
class DescribeDomainRegionDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainRegionDataResponseBody,
        };
    }
}
exports.DescribeDomainRegionDataResponse = DescribeDomainRegionDataResponse;
class DescribeDomainReqHitRateDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainReqHitRateDataRequest = DescribeDomainReqHitRateDataRequest;
class DescribeDomainReqHitRateDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            reqHitRateInterval: 'ReqHitRateInterval',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            reqHitRateInterval: DescribeDomainReqHitRateDataResponseBodyReqHitRateInterval,
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainReqHitRateDataResponseBody = DescribeDomainReqHitRateDataResponseBody;
class DescribeDomainReqHitRateDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainReqHitRateDataResponseBody,
        };
    }
}
exports.DescribeDomainReqHitRateDataResponse = DescribeDomainReqHitRateDataResponse;
class DescribeDomainsBySourceRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            sources: 'Sources',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            sources: 'string',
        };
    }
}
exports.DescribeDomainsBySourceRequest = DescribeDomainsBySourceRequest;
class DescribeDomainsBySourceResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainsList: 'DomainsList',
            sources: 'Sources',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainsList: DescribeDomainsBySourceResponseBodyDomainsList,
            sources: 'string',
        };
    }
}
exports.DescribeDomainsBySourceResponseBody = DescribeDomainsBySourceResponseBody;
class DescribeDomainsBySourceResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainsBySourceResponseBody,
        };
    }
}
exports.DescribeDomainsBySourceResponse = DescribeDomainsBySourceResponse;
class DescribeDomainSrcBpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainSrcBpsDataRequest = DescribeDomainSrcBpsDataRequest;
class DescribeDomainSrcBpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            srcBpsDataPerInterval: 'SrcBpsDataPerInterval',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            srcBpsDataPerInterval: DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerInterval,
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainSrcBpsDataResponseBody = DescribeDomainSrcBpsDataResponseBody;
class DescribeDomainSrcBpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainSrcBpsDataResponseBody,
        };
    }
}
exports.DescribeDomainSrcBpsDataResponse = DescribeDomainSrcBpsDataResponse;
class DescribeDomainSrcHttpCodeDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataRequest = DescribeDomainSrcHttpCodeDataRequest;
class DescribeDomainSrcHttpCodeDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            httpCodeData: 'HttpCodeData',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            httpCodeData: DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeData,
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponseBody = DescribeDomainSrcHttpCodeDataResponseBody;
class DescribeDomainSrcHttpCodeDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainSrcHttpCodeDataResponseBody,
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponse = DescribeDomainSrcHttpCodeDataResponse;
class DescribeDomainSrcQpsDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainSrcQpsDataRequest = DescribeDomainSrcQpsDataRequest;
class DescribeDomainSrcQpsDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            srcQpsDataPerInterval: 'SrcQpsDataPerInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            srcQpsDataPerInterval: DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerInterval,
        };
    }
}
exports.DescribeDomainSrcQpsDataResponseBody = DescribeDomainSrcQpsDataResponseBody;
class DescribeDomainSrcQpsDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainSrcQpsDataResponseBody,
        };
    }
}
exports.DescribeDomainSrcQpsDataResponse = DescribeDomainSrcQpsDataResponse;
class DescribeDomainSrcTopUrlVisitRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            sortBy: 'SortBy',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            sortBy: 'string',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitRequest = DescribeDomainSrcTopUrlVisitRequest;
class DescribeDomainSrcTopUrlVisitResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            url500List: 'Url500List',
            url200List: 'Url200List',
            url400List: 'Url400List',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            url300List: 'Url300List',
            allUrlList: 'AllUrlList',
        };
    }
    static types() {
        return {
            url500List: DescribeDomainSrcTopUrlVisitResponseBodyUrl500List,
            url200List: DescribeDomainSrcTopUrlVisitResponseBodyUrl200List,
            url400List: DescribeDomainSrcTopUrlVisitResponseBodyUrl400List,
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            url300List: DescribeDomainSrcTopUrlVisitResponseBodyUrl300List,
            allUrlList: DescribeDomainSrcTopUrlVisitResponseBodyAllUrlList,
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBody = DescribeDomainSrcTopUrlVisitResponseBody;
class DescribeDomainSrcTopUrlVisitResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainSrcTopUrlVisitResponseBody,
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponse = DescribeDomainSrcTopUrlVisitResponse;
class DescribeDomainSrcTrafficDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainSrcTrafficDataRequest = DescribeDomainSrcTrafficDataRequest;
class DescribeDomainSrcTrafficDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            srcTrafficDataPerInterval: 'SrcTrafficDataPerInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            srcTrafficDataPerInterval: DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerInterval,
        };
    }
}
exports.DescribeDomainSrcTrafficDataResponseBody = DescribeDomainSrcTrafficDataResponseBody;
class DescribeDomainSrcTrafficDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainSrcTrafficDataResponseBody,
        };
    }
}
exports.DescribeDomainSrcTrafficDataResponse = DescribeDomainSrcTrafficDataResponse;
class DescribeDomainsUsageByDayRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainsUsageByDayRequest = DescribeDomainsUsageByDayRequest;
class DescribeDomainsUsageByDayResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageTotal: 'UsageTotal',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
            usageByDays: 'UsageByDays',
        };
    }
    static types() {
        return {
            usageTotal: DescribeDomainsUsageByDayResponseBodyUsageTotal,
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
            usageByDays: DescribeDomainsUsageByDayResponseBodyUsageByDays,
        };
    }
}
exports.DescribeDomainsUsageByDayResponseBody = DescribeDomainsUsageByDayResponseBody;
class DescribeDomainsUsageByDayResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainsUsageByDayResponseBody,
        };
    }
}
exports.DescribeDomainsUsageByDayResponse = DescribeDomainsUsageByDayResponse;
class DescribeDomainTopClientIpVisitRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            locationNameEn: 'LocationNameEn',
            startTime: 'StartTime',
            endTime: 'EndTime',
            sortBy: 'SortBy',
            limit: 'Limit',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            locationNameEn: 'string',
            startTime: 'string',
            endTime: 'string',
            sortBy: 'string',
            limit: 'string',
        };
    }
}
exports.DescribeDomainTopClientIpVisitRequest = DescribeDomainTopClientIpVisitRequest;
class DescribeDomainTopClientIpVisitResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            clientIpList: 'ClientIpList',
        };
    }
    static types() {
        return {
            requestId: 'string',
            clientIpList: { 'type': 'array', 'itemType': DescribeDomainTopClientIpVisitResponseBodyClientIpList },
        };
    }
}
exports.DescribeDomainTopClientIpVisitResponseBody = DescribeDomainTopClientIpVisitResponseBody;
class DescribeDomainTopClientIpVisitResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainTopClientIpVisitResponseBody,
        };
    }
}
exports.DescribeDomainTopClientIpVisitResponse = DescribeDomainTopClientIpVisitResponse;
class DescribeDomainTopReferVisitRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            sortBy: 'SortBy',
            percent: 'Percent',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            sortBy: 'string',
            percent: 'string',
        };
    }
}
exports.DescribeDomainTopReferVisitRequest = DescribeDomainTopReferVisitRequest;
class DescribeDomainTopReferVisitResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            topReferList: 'TopReferList',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            topReferList: DescribeDomainTopReferVisitResponseBodyTopReferList,
        };
    }
}
exports.DescribeDomainTopReferVisitResponseBody = DescribeDomainTopReferVisitResponseBody;
class DescribeDomainTopReferVisitResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainTopReferVisitResponseBody,
        };
    }
}
exports.DescribeDomainTopReferVisitResponse = DescribeDomainTopReferVisitResponse;
class DescribeDomainTopUrlVisitRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            sortBy: 'SortBy',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            sortBy: 'string',
        };
    }
}
exports.DescribeDomainTopUrlVisitRequest = DescribeDomainTopUrlVisitRequest;
class DescribeDomainTopUrlVisitResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            url500List: 'Url500List',
            url200List: 'Url200List',
            url400List: 'Url400List',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            url300List: 'Url300List',
            allUrlList: 'AllUrlList',
        };
    }
    static types() {
        return {
            url500List: DescribeDomainTopUrlVisitResponseBodyUrl500List,
            url200List: DescribeDomainTopUrlVisitResponseBodyUrl200List,
            url400List: DescribeDomainTopUrlVisitResponseBodyUrl400List,
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            url300List: DescribeDomainTopUrlVisitResponseBodyUrl300List,
            allUrlList: DescribeDomainTopUrlVisitResponseBodyAllUrlList,
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBody = DescribeDomainTopUrlVisitResponseBody;
class DescribeDomainTopUrlVisitResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainTopUrlVisitResponseBody,
        };
    }
}
exports.DescribeDomainTopUrlVisitResponse = DescribeDomainTopUrlVisitResponse;
class DescribeDomainTrafficDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            ispNameEn: 'IspNameEn',
            locationNameEn: 'LocationNameEn',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            ispNameEn: 'string',
            locationNameEn: 'string',
        };
    }
}
exports.DescribeDomainTrafficDataRequest = DescribeDomainTrafficDataRequest;
class DescribeDomainTrafficDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            trafficDataPerInterval: 'TrafficDataPerInterval',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            trafficDataPerInterval: DescribeDomainTrafficDataResponseBodyTrafficDataPerInterval,
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainTrafficDataResponseBody = DescribeDomainTrafficDataResponseBody;
class DescribeDomainTrafficDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainTrafficDataResponseBody,
        };
    }
}
exports.DescribeDomainTrafficDataResponse = DescribeDomainTrafficDataResponse;
class DescribeDomainUsageDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            dataProtocol: 'DataProtocol',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
            area: 'Area',
            field: 'Field',
            interval: 'Interval',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            dataProtocol: 'string',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
            area: 'string',
            field: 'string',
            interval: 'string',
        };
    }
}
exports.DescribeDomainUsageDataRequest = DescribeDomainUsageDataRequest;
class DescribeDomainUsageDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageDataPerInterval: 'UsageDataPerInterval',
            type: 'Type',
            area: 'Area',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            usageDataPerInterval: DescribeDomainUsageDataResponseBodyUsageDataPerInterval,
            type: 'string',
            area: 'string',
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainUsageDataResponseBody = DescribeDomainUsageDataResponseBody;
class DescribeDomainUsageDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainUsageDataResponseBody,
        };
    }
}
exports.DescribeDomainUsageDataResponse = DescribeDomainUsageDataResponse;
class DescribeDomainUvDataRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            endTime: 'EndTime',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            startTime: 'string',
            endTime: 'string',
        };
    }
}
exports.DescribeDomainUvDataRequest = DescribeDomainUvDataRequest;
class DescribeDomainUvDataResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            uvDataInterval: 'UvDataInterval',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainName: 'DomainName',
            startTime: 'StartTime',
            dataInterval: 'DataInterval',
        };
    }
    static types() {
        return {
            uvDataInterval: DescribeDomainUvDataResponseBodyUvDataInterval,
            endTime: 'string',
            requestId: 'string',
            domainName: 'string',
            startTime: 'string',
            dataInterval: 'string',
        };
    }
}
exports.DescribeDomainUvDataResponseBody = DescribeDomainUvDataResponseBody;
class DescribeDomainUvDataResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeDomainUvDataResponseBody,
        };
    }
}
exports.DescribeDomainUvDataResponse = DescribeDomainUvDataResponse;
class DescribeFCTriggerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            triggerARN: 'TriggerARN',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            triggerARN: 'string',
        };
    }
}
exports.DescribeFCTriggerRequest = DescribeFCTriggerRequest;
class DescribeFCTriggerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            FCTrigger: 'FCTrigger',
        };
    }
    static types() {
        return {
            requestId: 'string',
            FCTrigger: DescribeFCTriggerResponseBodyFCTrigger,
        };
    }
}
exports.DescribeFCTriggerResponseBody = DescribeFCTriggerResponseBody;
class DescribeFCTriggerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeFCTriggerResponseBody,
        };
    }
}
exports.DescribeFCTriggerResponse = DescribeFCTriggerResponse;
class DescribeIllegalUrlExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            taskId: 'string',
        };
    }
}
exports.DescribeIllegalUrlExportTaskRequest = DescribeIllegalUrlExportTaskRequest;
class DescribeIllegalUrlExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            requestId: 'RequestId',
            downloadUrl: 'DownloadUrl',
        };
    }
    static types() {
        return {
            status: 'string',
            requestId: 'string',
            downloadUrl: 'string',
        };
    }
}
exports.DescribeIllegalUrlExportTaskResponseBody = DescribeIllegalUrlExportTaskResponseBody;
class DescribeIllegalUrlExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeIllegalUrlExportTaskResponseBody,
        };
    }
}
exports.DescribeIllegalUrlExportTaskResponse = DescribeIllegalUrlExportTaskResponse;
class DescribeIpInfoRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            IP: 'IP',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            IP: 'string',
        };
    }
}
exports.DescribeIpInfoRequest = DescribeIpInfoRequest;
class DescribeIpInfoResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            ISP: 'ISP',
            region: 'Region',
            ispEname: 'IspEname',
            cdnIp: 'CdnIp',
            regionEname: 'RegionEname',
        };
    }
    static types() {
        return {
            requestId: 'string',
            ISP: 'string',
            region: 'string',
            ispEname: 'string',
            cdnIp: 'string',
            regionEname: 'string',
        };
    }
}
exports.DescribeIpInfoResponseBody = DescribeIpInfoResponseBody;
class DescribeIpInfoResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeIpInfoResponseBody,
        };
    }
}
exports.DescribeIpInfoResponse = DescribeIpInfoResponse;
class DescribeL2VipsByDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeL2VipsByDomainRequest = DescribeL2VipsByDomainRequest;
class DescribeL2VipsByDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainName: 'DomainName',
            vips: 'Vips',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainName: 'string',
            vips: DescribeL2VipsByDomainResponseBodyVips,
        };
    }
}
exports.DescribeL2VipsByDomainResponseBody = DescribeL2VipsByDomainResponseBody;
class DescribeL2VipsByDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeL2VipsByDomainResponseBody,
        };
    }
}
exports.DescribeL2VipsByDomainResponse = DescribeL2VipsByDomainResponse;
class DescribeRangeDataByLocateAndIspServiceRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainNames: 'DomainNames',
            startTime: 'StartTime',
            endTime: 'EndTime',
            ispNames: 'IspNames',
            locationNames: 'LocationNames',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainNames: 'string',
            startTime: 'string',
            endTime: 'string',
            ispNames: 'string',
            locationNames: 'string',
        };
    }
}
exports.DescribeRangeDataByLocateAndIspServiceRequest = DescribeRangeDataByLocateAndIspServiceRequest;
class DescribeRangeDataByLocateAndIspServiceResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            jsonResult: 'JsonResult',
        };
    }
    static types() {
        return {
            requestId: 'string',
            jsonResult: 'string',
        };
    }
}
exports.DescribeRangeDataByLocateAndIspServiceResponseBody = DescribeRangeDataByLocateAndIspServiceResponseBody;
class DescribeRangeDataByLocateAndIspServiceResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeRangeDataByLocateAndIspServiceResponseBody,
        };
    }
}
exports.DescribeRangeDataByLocateAndIspServiceResponse = DescribeRangeDataByLocateAndIspServiceResponse;
class DescribeRealtimeDeliveryAccRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
            interval: 'Interval',
            project: 'Project',
            logStore: 'LogStore',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
            interval: 'string',
            project: 'string',
            logStore: 'string',
        };
    }
}
exports.DescribeRealtimeDeliveryAccRequest = DescribeRealtimeDeliveryAccRequest;
class DescribeRealtimeDeliveryAccResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            reatTimeDeliveryAccData: 'ReatTimeDeliveryAccData',
        };
    }
    static types() {
        return {
            requestId: 'string',
            reatTimeDeliveryAccData: DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccData,
        };
    }
}
exports.DescribeRealtimeDeliveryAccResponseBody = DescribeRealtimeDeliveryAccResponseBody;
class DescribeRealtimeDeliveryAccResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeRealtimeDeliveryAccResponseBody,
        };
    }
}
exports.DescribeRealtimeDeliveryAccResponse = DescribeRealtimeDeliveryAccResponse;
class DescribeRefreshQuotaRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
        };
    }
}
exports.DescribeRefreshQuotaRequest = DescribeRefreshQuotaRequest;
class DescribeRefreshQuotaResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            blockRemain: 'BlockRemain',
            regexRemain: 'RegexRemain',
            dirRemain: 'DirRemain',
            urlQuota: 'UrlQuota',
            preloadQuota: 'PreloadQuota',
            preloadEdgeQuota: 'PreloadEdgeQuota',
            urlRemain: 'UrlRemain',
            preloadEdgeRemain: 'PreloadEdgeRemain',
            preloadRemain: 'PreloadRemain',
            blockQuota: 'BlockQuota',
            regexQuota: 'RegexQuota',
            dirQuota: 'DirQuota',
        };
    }
    static types() {
        return {
            requestId: 'string',
            blockRemain: 'string',
            regexRemain: 'string',
            dirRemain: 'string',
            urlQuota: 'string',
            preloadQuota: 'string',
            preloadEdgeQuota: 'string',
            urlRemain: 'string',
            preloadEdgeRemain: 'string',
            preloadRemain: 'string',
            blockQuota: 'string',
            regexQuota: 'string',
            dirQuota: 'string',
        };
    }
}
exports.DescribeRefreshQuotaResponseBody = DescribeRefreshQuotaResponseBody;
class DescribeRefreshQuotaResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeRefreshQuotaResponseBody,
        };
    }
}
exports.DescribeRefreshQuotaResponse = DescribeRefreshQuotaResponse;
class DescribeRefreshTaskByIdRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            taskId: 'string',
        };
    }
}
exports.DescribeRefreshTaskByIdRequest = DescribeRefreshTaskByIdRequest;
class DescribeRefreshTaskByIdResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalCount: 'TotalCount',
            tasks: 'Tasks',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            totalCount: 'number',
            tasks: { 'type': 'array', 'itemType': DescribeRefreshTaskByIdResponseBodyTasks },
            requestId: 'string',
        };
    }
}
exports.DescribeRefreshTaskByIdResponseBody = DescribeRefreshTaskByIdResponseBody;
class DescribeRefreshTaskByIdResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeRefreshTaskByIdResponseBody,
        };
    }
}
exports.DescribeRefreshTaskByIdResponse = DescribeRefreshTaskByIdResponse;
class DescribeRefreshTasksRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            taskId: 'TaskId',
            objectPath: 'ObjectPath',
            pageNumber: 'PageNumber',
            objectType: 'ObjectType',
            domainName: 'DomainName',
            status: 'Status',
            pageSize: 'PageSize',
            startTime: 'StartTime',
            endTime: 'EndTime',
            resourceGroupId: 'ResourceGroupId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            taskId: 'string',
            objectPath: 'string',
            pageNumber: 'number',
            objectType: 'string',
            domainName: 'string',
            status: 'string',
            pageSize: 'number',
            startTime: 'string',
            endTime: 'string',
            resourceGroupId: 'string',
        };
    }
}
exports.DescribeRefreshTasksRequest = DescribeRefreshTasksRequest;
class DescribeRefreshTasksResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalCount: 'TotalCount',
            tasks: 'Tasks',
            requestId: 'RequestId',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            totalCount: 'number',
            tasks: DescribeRefreshTasksResponseBodyTasks,
            requestId: 'string',
            pageSize: 'number',
            pageNumber: 'number',
        };
    }
}
exports.DescribeRefreshTasksResponseBody = DescribeRefreshTasksResponseBody;
class DescribeRefreshTasksResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeRefreshTasksResponseBody,
        };
    }
}
exports.DescribeRefreshTasksResponse = DescribeRefreshTasksResponse;
class DescribeStagingIpRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
        };
    }
}
exports.DescribeStagingIpRequest = DescribeStagingIpRequest;
class DescribeStagingIpResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            IPV4s: 'IPV4s',
        };
    }
    static types() {
        return {
            requestId: 'string',
            IPV4s: DescribeStagingIpResponseBodyIPV4s,
        };
    }
}
exports.DescribeStagingIpResponseBody = DescribeStagingIpResponseBody;
class DescribeStagingIpResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeStagingIpResponseBody,
        };
    }
}
exports.DescribeStagingIpResponse = DescribeStagingIpResponse;
class DescribeTagResourcesRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            resourceType: 'ResourceType',
            scope: 'Scope',
            resourceId: 'ResourceId',
            tag: 'Tag',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            resourceType: 'string',
            scope: 'string',
            resourceId: { 'type': 'array', 'itemType': 'string' },
            tag: { 'type': 'array', 'itemType': DescribeTagResourcesRequestTag },
        };
    }
}
exports.DescribeTagResourcesRequest = DescribeTagResourcesRequest;
class DescribeTagResourcesResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            tagResources: 'TagResources',
        };
    }
    static types() {
        return {
            requestId: 'string',
            tagResources: { 'type': 'array', 'itemType': DescribeTagResourcesResponseBodyTagResources },
        };
    }
}
exports.DescribeTagResourcesResponseBody = DescribeTagResourcesResponseBody;
class DescribeTagResourcesResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeTagResourcesResponseBody,
        };
    }
}
exports.DescribeTagResourcesResponse = DescribeTagResourcesResponse;
class DescribeTopDomainsByFlowRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            startTime: 'StartTime',
            endTime: 'EndTime',
            limit: 'Limit',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            startTime: 'string',
            endTime: 'string',
            limit: 'number',
        };
    }
}
exports.DescribeTopDomainsByFlowRequest = DescribeTopDomainsByFlowRequest;
class DescribeTopDomainsByFlowResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            topDomains: 'TopDomains',
            endTime: 'EndTime',
            requestId: 'RequestId',
            domainOnlineCount: 'DomainOnlineCount',
            startTime: 'StartTime',
            domainCount: 'DomainCount',
        };
    }
    static types() {
        return {
            topDomains: DescribeTopDomainsByFlowResponseBodyTopDomains,
            endTime: 'string',
            requestId: 'string',
            domainOnlineCount: 'number',
            startTime: 'string',
            domainCount: 'number',
        };
    }
}
exports.DescribeTopDomainsByFlowResponseBody = DescribeTopDomainsByFlowResponseBody;
class DescribeTopDomainsByFlowResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeTopDomainsByFlowResponseBody,
        };
    }
}
exports.DescribeTopDomainsByFlowResponse = DescribeTopDomainsByFlowResponse;
class DescribeUserCertificateExpireCountRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
        };
    }
}
exports.DescribeUserCertificateExpireCountRequest = DescribeUserCertificateExpireCountRequest;
class DescribeUserCertificateExpireCountResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            expireWithin30DaysCount: 'ExpireWithin30DaysCount',
            expiredCount: 'ExpiredCount',
        };
    }
    static types() {
        return {
            requestId: 'string',
            expireWithin30DaysCount: 'number',
            expiredCount: 'number',
        };
    }
}
exports.DescribeUserCertificateExpireCountResponseBody = DescribeUserCertificateExpireCountResponseBody;
class DescribeUserCertificateExpireCountResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserCertificateExpireCountResponseBody,
        };
    }
}
exports.DescribeUserCertificateExpireCountResponse = DescribeUserCertificateExpireCountResponse;
class DescribeUserConfigsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            config: 'Config',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            config: 'string',
        };
    }
}
exports.DescribeUserConfigsRequest = DescribeUserConfigsRequest;
class DescribeUserConfigsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            configs: 'Configs',
        };
    }
    static types() {
        return {
            requestId: 'string',
            configs: DescribeUserConfigsResponseBodyConfigs,
        };
    }
}
exports.DescribeUserConfigsResponseBody = DescribeUserConfigsResponseBody;
class DescribeUserConfigsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserConfigsResponseBody,
        };
    }
}
exports.DescribeUserConfigsResponse = DescribeUserConfigsResponse;
class DescribeUserDomainsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
            domainName: 'DomainName',
            domainStatus: 'DomainStatus',
            domainSearchType: 'DomainSearchType',
            cdnType: 'CdnType',
            checkDomainShow: 'CheckDomainShow',
            resourceGroupId: 'ResourceGroupId',
            changeStartTime: 'ChangeStartTime',
            changeEndTime: 'ChangeEndTime',
            funcId: 'FuncId',
            funcFilter: 'FuncFilter',
            coverage: 'Coverage',
            tag: 'Tag',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            pageSize: 'number',
            pageNumber: 'number',
            domainName: 'string',
            domainStatus: 'string',
            domainSearchType: 'string',
            cdnType: 'string',
            checkDomainShow: 'boolean',
            resourceGroupId: 'string',
            changeStartTime: 'string',
            changeEndTime: 'string',
            funcId: 'string',
            funcFilter: 'string',
            coverage: 'string',
            tag: { 'type': 'array', 'itemType': DescribeUserDomainsRequestTag },
        };
    }
}
exports.DescribeUserDomainsRequest = DescribeUserDomainsRequest;
class DescribeUserDomainsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domains: 'Domains',
            totalCount: 'TotalCount',
            requestId: 'RequestId',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            domains: DescribeUserDomainsResponseBodyDomains,
            totalCount: 'number',
            requestId: 'string',
            pageSize: 'number',
            pageNumber: 'number',
        };
    }
}
exports.DescribeUserDomainsResponseBody = DescribeUserDomainsResponseBody;
class DescribeUserDomainsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserDomainsResponseBody,
        };
    }
}
exports.DescribeUserDomainsResponse = DescribeUserDomainsResponse;
class DescribeUserTagsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
        };
    }
}
exports.DescribeUserTagsRequest = DescribeUserTagsRequest;
class DescribeUserTagsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            tags: 'Tags',
        };
    }
    static types() {
        return {
            requestId: 'string',
            tags: { 'type': 'array', 'itemType': DescribeUserTagsResponseBodyTags },
        };
    }
}
exports.DescribeUserTagsResponseBody = DescribeUserTagsResponseBody;
class DescribeUserTagsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserTagsResponseBody,
        };
    }
}
exports.DescribeUserTagsResponse = DescribeUserTagsResponse;
class DescribeUserUsageDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            pageSize: 'string',
            pageNumber: 'string',
        };
    }
}
exports.DescribeUserUsageDataExportTaskRequest = DescribeUserUsageDataExportTaskRequest;
class DescribeUserUsageDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            usageDataPerPage: 'UsageDataPerPage',
        };
    }
    static types() {
        return {
            requestId: 'string',
            usageDataPerPage: DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPage,
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponseBody = DescribeUserUsageDataExportTaskResponseBody;
class DescribeUserUsageDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserUsageDataExportTaskResponseBody,
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponse = DescribeUserUsageDataExportTaskResponse;
class DescribeUserUsageDetailDataExportTaskRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            pageSize: 'string',
            pageNumber: 'string',
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskRequest = DescribeUserUsageDetailDataExportTaskRequest;
class DescribeUserUsageDetailDataExportTaskResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            usageDataPerPage: 'UsageDataPerPage',
        };
    }
    static types() {
        return {
            requestId: 'string',
            usageDataPerPage: DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPage,
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponseBody = DescribeUserUsageDetailDataExportTaskResponseBody;
class DescribeUserUsageDetailDataExportTaskResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserUsageDetailDataExportTaskResponseBody,
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponse = DescribeUserUsageDetailDataExportTaskResponse;
class DescribeUserVipsByDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            available: 'Available',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            available: 'string',
        };
    }
}
exports.DescribeUserVipsByDomainRequest = DescribeUserVipsByDomainRequest;
class DescribeUserVipsByDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            domainName: 'DomainName',
            vips: 'Vips',
        };
    }
    static types() {
        return {
            requestId: 'string',
            domainName: 'string',
            vips: DescribeUserVipsByDomainResponseBodyVips,
        };
    }
}
exports.DescribeUserVipsByDomainResponseBody = DescribeUserVipsByDomainResponseBody;
class DescribeUserVipsByDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeUserVipsByDomainResponseBody,
        };
    }
}
exports.DescribeUserVipsByDomainResponse = DescribeUserVipsByDomainResponse;
class DescribeVerifyContentRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
        };
    }
}
exports.DescribeVerifyContentRequest = DescribeVerifyContentRequest;
class DescribeVerifyContentResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            content: 'Content',
        };
    }
    static types() {
        return {
            requestId: 'string',
            content: 'string',
        };
    }
}
exports.DescribeVerifyContentResponseBody = DescribeVerifyContentResponseBody;
class DescribeVerifyContentResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DescribeVerifyContentResponseBody,
        };
    }
}
exports.DescribeVerifyContentResponse = DescribeVerifyContentResponse;
class DisableRealtimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domain: 'Domain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domain: 'string',
        };
    }
}
exports.DisableRealtimeLogDeliveryRequest = DisableRealtimeLogDeliveryRequest;
class DisableRealtimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.DisableRealtimeLogDeliveryResponseBody = DisableRealtimeLogDeliveryResponseBody;
class DisableRealtimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: DisableRealtimeLogDeliveryResponseBody,
        };
    }
}
exports.DisableRealtimeLogDeliveryResponse = DisableRealtimeLogDeliveryResponse;
class EnableRealtimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domain: 'Domain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domain: 'string',
        };
    }
}
exports.EnableRealtimeLogDeliveryRequest = EnableRealtimeLogDeliveryRequest;
class EnableRealtimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.EnableRealtimeLogDeliveryResponseBody = EnableRealtimeLogDeliveryResponseBody;
class EnableRealtimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: EnableRealtimeLogDeliveryResponseBody,
        };
    }
}
exports.EnableRealtimeLogDeliveryResponse = EnableRealtimeLogDeliveryResponse;
class ListDomainsByLogConfigIdRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            configId: 'string',
        };
    }
}
exports.ListDomainsByLogConfigIdRequest = ListDomainsByLogConfigIdRequest;
class ListDomainsByLogConfigIdResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domains: 'Domains',
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            domains: ListDomainsByLogConfigIdResponseBodyDomains,
            requestId: 'string',
        };
    }
}
exports.ListDomainsByLogConfigIdResponseBody = ListDomainsByLogConfigIdResponseBody;
class ListDomainsByLogConfigIdResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ListDomainsByLogConfigIdResponseBody,
        };
    }
}
exports.ListDomainsByLogConfigIdResponse = ListDomainsByLogConfigIdResponse;
class ListFCTriggerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            eventMetaName: 'EventMetaName',
            eventMetaVersion: 'EventMetaVersion',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            eventMetaName: 'string',
            eventMetaVersion: 'string',
        };
    }
}
exports.ListFCTriggerRequest = ListFCTriggerRequest;
class ListFCTriggerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            FCTriggers: 'FCTriggers',
        };
    }
    static types() {
        return {
            requestId: 'string',
            FCTriggers: { 'type': 'array', 'itemType': ListFCTriggerResponseBodyFCTriggers },
        };
    }
}
exports.ListFCTriggerResponseBody = ListFCTriggerResponseBody;
class ListFCTriggerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ListFCTriggerResponseBody,
        };
    }
}
exports.ListFCTriggerResponse = ListFCTriggerResponse;
class ListRealtimeLogDeliveryDomainsRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            project: 'Project',
            logstore: 'Logstore',
            region: 'Region',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            project: 'string',
            logstore: 'string',
            region: 'string',
        };
    }
}
exports.ListRealtimeLogDeliveryDomainsRequest = ListRealtimeLogDeliveryDomainsRequest;
class ListRealtimeLogDeliveryDomainsResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            content: 'Content',
        };
    }
    static types() {
        return {
            requestId: 'string',
            content: ListRealtimeLogDeliveryDomainsResponseBodyContent,
        };
    }
}
exports.ListRealtimeLogDeliveryDomainsResponseBody = ListRealtimeLogDeliveryDomainsResponseBody;
class ListRealtimeLogDeliveryDomainsResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ListRealtimeLogDeliveryDomainsResponseBody,
        };
    }
}
exports.ListRealtimeLogDeliveryDomainsResponse = ListRealtimeLogDeliveryDomainsResponse;
class ListRealtimeLogDeliveryInfosRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
        };
    }
}
exports.ListRealtimeLogDeliveryInfosRequest = ListRealtimeLogDeliveryInfosRequest;
class ListRealtimeLogDeliveryInfosResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            content: 'Content',
        };
    }
    static types() {
        return {
            requestId: 'string',
            content: ListRealtimeLogDeliveryInfosResponseBodyContent,
        };
    }
}
exports.ListRealtimeLogDeliveryInfosResponseBody = ListRealtimeLogDeliveryInfosResponseBody;
class ListRealtimeLogDeliveryInfosResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ListRealtimeLogDeliveryInfosResponseBody,
        };
    }
}
exports.ListRealtimeLogDeliveryInfosResponse = ListRealtimeLogDeliveryInfosResponse;
class ListUserCustomLogConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
        };
    }
}
exports.ListUserCustomLogConfigRequest = ListUserCustomLogConfigRequest;
class ListUserCustomLogConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            configIds: 'ConfigIds',
        };
    }
    static types() {
        return {
            requestId: 'string',
            configIds: ListUserCustomLogConfigResponseBodyConfigIds,
        };
    }
}
exports.ListUserCustomLogConfigResponseBody = ListUserCustomLogConfigResponseBody;
class ListUserCustomLogConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ListUserCustomLogConfigResponseBody,
        };
    }
}
exports.ListUserCustomLogConfigResponse = ListUserCustomLogConfigResponse;
class ModifyCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            sources: 'Sources',
            resourceGroupId: 'ResourceGroupId',
            topLevelDomain: 'TopLevelDomain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            sources: 'string',
            resourceGroupId: 'string',
            topLevelDomain: 'string',
        };
    }
}
exports.ModifyCdnDomainRequest = ModifyCdnDomainRequest;
class ModifyCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyCdnDomainResponseBody = ModifyCdnDomainResponseBody;
class ModifyCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyCdnDomainResponseBody,
        };
    }
}
exports.ModifyCdnDomainResponse = ModifyCdnDomainResponse;
class ModifyCdnDomainSchdmByPropertyRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            property: 'Property',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            property: 'string',
        };
    }
}
exports.ModifyCdnDomainSchdmByPropertyRequest = ModifyCdnDomainSchdmByPropertyRequest;
class ModifyCdnDomainSchdmByPropertyResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyCdnDomainSchdmByPropertyResponseBody = ModifyCdnDomainSchdmByPropertyResponseBody;
class ModifyCdnDomainSchdmByPropertyResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyCdnDomainSchdmByPropertyResponseBody,
        };
    }
}
exports.ModifyCdnDomainSchdmByPropertyResponse = ModifyCdnDomainSchdmByPropertyResponse;
class ModifyCdnServiceRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            internetChargeType: 'InternetChargeType',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            internetChargeType: 'string',
        };
    }
}
exports.ModifyCdnServiceRequest = ModifyCdnServiceRequest;
class ModifyCdnServiceResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyCdnServiceResponseBody = ModifyCdnServiceResponseBody;
class ModifyCdnServiceResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyCdnServiceResponseBody,
        };
    }
}
exports.ModifyCdnServiceResponse = ModifyCdnServiceResponse;
class ModifyDomainCustomLogConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'string',
        };
    }
}
exports.ModifyDomainCustomLogConfigRequest = ModifyDomainCustomLogConfigRequest;
class ModifyDomainCustomLogConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyDomainCustomLogConfigResponseBody = ModifyDomainCustomLogConfigResponseBody;
class ModifyDomainCustomLogConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyDomainCustomLogConfigResponseBody,
        };
    }
}
exports.ModifyDomainCustomLogConfigResponse = ModifyDomainCustomLogConfigResponse;
class ModifyRealtimeLogDeliveryRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            project: 'Project',
            logstore: 'Logstore',
            region: 'Region',
            domain: 'Domain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            project: 'string',
            logstore: 'string',
            region: 'string',
            domain: 'string',
        };
    }
}
exports.ModifyRealtimeLogDeliveryRequest = ModifyRealtimeLogDeliveryRequest;
class ModifyRealtimeLogDeliveryResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyRealtimeLogDeliveryResponseBody = ModifyRealtimeLogDeliveryResponseBody;
class ModifyRealtimeLogDeliveryResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyRealtimeLogDeliveryResponseBody,
        };
    }
}
exports.ModifyRealtimeLogDeliveryResponse = ModifyRealtimeLogDeliveryResponse;
class ModifyUserCustomLogConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            configId: 'ConfigId',
            tag: 'Tag',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            configId: 'string',
            tag: 'string',
        };
    }
}
exports.ModifyUserCustomLogConfigRequest = ModifyUserCustomLogConfigRequest;
class ModifyUserCustomLogConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.ModifyUserCustomLogConfigResponseBody = ModifyUserCustomLogConfigResponseBody;
class ModifyUserCustomLogConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: ModifyUserCustomLogConfigResponseBody,
        };
    }
}
exports.ModifyUserCustomLogConfigResponse = ModifyUserCustomLogConfigResponse;
class OpenCdnServiceRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            internetChargeType: 'InternetChargeType',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            internetChargeType: 'string',
        };
    }
}
exports.OpenCdnServiceRequest = OpenCdnServiceRequest;
class OpenCdnServiceResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.OpenCdnServiceResponseBody = OpenCdnServiceResponseBody;
class OpenCdnServiceResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: OpenCdnServiceResponseBody,
        };
    }
}
exports.OpenCdnServiceResponse = OpenCdnServiceResponse;
class PublishStagingConfigToProductionRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            functionName: 'FunctionName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            functionName: 'string',
        };
    }
}
exports.PublishStagingConfigToProductionRequest = PublishStagingConfigToProductionRequest;
class PublishStagingConfigToProductionResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.PublishStagingConfigToProductionResponseBody = PublishStagingConfigToProductionResponseBody;
class PublishStagingConfigToProductionResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: PublishStagingConfigToProductionResponseBody,
        };
    }
}
exports.PublishStagingConfigToProductionResponse = PublishStagingConfigToProductionResponse;
class PushObjectCacheRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            objectPath: 'ObjectPath',
            area: 'Area',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            objectPath: 'string',
            area: 'string',
        };
    }
}
exports.PushObjectCacheRequest = PushObjectCacheRequest;
class PushObjectCacheResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            pushTaskId: 'PushTaskId',
        };
    }
    static types() {
        return {
            requestId: 'string',
            pushTaskId: 'string',
        };
    }
}
exports.PushObjectCacheResponseBody = PushObjectCacheResponseBody;
class PushObjectCacheResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: PushObjectCacheResponseBody,
        };
    }
}
exports.PushObjectCacheResponse = PushObjectCacheResponse;
class RefreshObjectCachesRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            objectPath: 'ObjectPath',
            objectType: 'ObjectType',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            objectPath: 'string',
            objectType: 'string',
        };
    }
}
exports.RefreshObjectCachesRequest = RefreshObjectCachesRequest;
class RefreshObjectCachesResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            refreshTaskId: 'RefreshTaskId',
        };
    }
    static types() {
        return {
            requestId: 'string',
            refreshTaskId: 'string',
        };
    }
}
exports.RefreshObjectCachesResponseBody = RefreshObjectCachesResponseBody;
class RefreshObjectCachesResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: RefreshObjectCachesResponseBody,
        };
    }
}
exports.RefreshObjectCachesResponse = RefreshObjectCachesResponse;
class RollbackStagingConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            functionName: 'FunctionName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            functionName: 'string',
        };
    }
}
exports.RollbackStagingConfigRequest = RollbackStagingConfigRequest;
class RollbackStagingConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.RollbackStagingConfigResponseBody = RollbackStagingConfigResponseBody;
class RollbackStagingConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: RollbackStagingConfigResponseBody,
        };
    }
}
exports.RollbackStagingConfigResponse = RollbackStagingConfigResponse;
class SetCcConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            allowIps: 'AllowIps',
            blockIps: 'BlockIps',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            allowIps: 'string',
            blockIps: 'string',
        };
    }
}
exports.SetCcConfigRequest = SetCcConfigRequest;
class SetCcConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetCcConfigResponseBody = SetCcConfigResponseBody;
class SetCcConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetCcConfigResponseBody,
        };
    }
}
exports.SetCcConfigResponse = SetCcConfigResponse;
class SetCdnDomainCSRCertificateRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            serverCertificate: 'ServerCertificate',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            serverCertificate: 'string',
            domainName: 'string',
        };
    }
}
exports.SetCdnDomainCSRCertificateRequest = SetCdnDomainCSRCertificateRequest;
class SetCdnDomainCSRCertificateResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetCdnDomainCSRCertificateResponseBody = SetCdnDomainCSRCertificateResponseBody;
class SetCdnDomainCSRCertificateResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetCdnDomainCSRCertificateResponseBody,
        };
    }
}
exports.SetCdnDomainCSRCertificateResponse = SetCdnDomainCSRCertificateResponse;
class SetCdnDomainStagingConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            functions: 'Functions',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            functions: 'string',
        };
    }
}
exports.SetCdnDomainStagingConfigRequest = SetCdnDomainStagingConfigRequest;
class SetCdnDomainStagingConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetCdnDomainStagingConfigResponseBody = SetCdnDomainStagingConfigResponseBody;
class SetCdnDomainStagingConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetCdnDomainStagingConfigResponseBody,
        };
    }
}
exports.SetCdnDomainStagingConfigResponse = SetCdnDomainStagingConfigResponse;
class SetConfigOfVersionRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            ownerAccount: 'OwnerAccount',
            securityToken: 'SecurityToken',
            versionId: 'VersionId',
            configId: 'ConfigId',
            functionId: 'FunctionId',
            functionName: 'FunctionName',
            functionArgs: 'FunctionArgs',
            functionMatches: 'FunctionMatches',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            ownerAccount: 'string',
            securityToken: 'string',
            versionId: 'string',
            configId: 'string',
            functionId: 'number',
            functionName: 'string',
            functionArgs: 'string',
            functionMatches: 'string',
        };
    }
}
exports.SetConfigOfVersionRequest = SetConfigOfVersionRequest;
class SetConfigOfVersionResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetConfigOfVersionResponseBody = SetConfigOfVersionResponseBody;
class SetConfigOfVersionResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetConfigOfVersionResponseBody,
        };
    }
}
exports.SetConfigOfVersionResponse = SetConfigOfVersionResponse;
class SetDomainGreenManagerConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            enable: 'Enable',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            enable: 'string',
        };
    }
}
exports.SetDomainGreenManagerConfigRequest = SetDomainGreenManagerConfigRequest;
class SetDomainGreenManagerConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetDomainGreenManagerConfigResponseBody = SetDomainGreenManagerConfigResponseBody;
class SetDomainGreenManagerConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetDomainGreenManagerConfigResponseBody,
        };
    }
}
exports.SetDomainGreenManagerConfigResponse = SetDomainGreenManagerConfigResponse;
class SetDomainServerCertificateRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            certName: 'CertName',
            certType: 'CertType',
            serverCertificateStatus: 'ServerCertificateStatus',
            serverCertificate: 'ServerCertificate',
            privateKey: 'PrivateKey',
            forceSet: 'ForceSet',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            certName: 'string',
            certType: 'string',
            serverCertificateStatus: 'string',
            serverCertificate: 'string',
            privateKey: 'string',
            forceSet: 'string',
        };
    }
}
exports.SetDomainServerCertificateRequest = SetDomainServerCertificateRequest;
class SetDomainServerCertificateResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetDomainServerCertificateResponseBody = SetDomainServerCertificateResponseBody;
class SetDomainServerCertificateResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetDomainServerCertificateResponseBody,
        };
    }
}
exports.SetDomainServerCertificateResponse = SetDomainServerCertificateResponse;
class SetErrorPageConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            pageType: 'PageType',
            customPageUrl: 'CustomPageUrl',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            pageType: 'string',
            customPageUrl: 'string',
        };
    }
}
exports.SetErrorPageConfigRequest = SetErrorPageConfigRequest;
class SetErrorPageConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetErrorPageConfigResponseBody = SetErrorPageConfigResponseBody;
class SetErrorPageConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetErrorPageConfigResponseBody,
        };
    }
}
exports.SetErrorPageConfigResponse = SetErrorPageConfigResponse;
class SetFileCacheExpiredConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            cacheContent: 'CacheContent',
            TTL: 'TTL',
            weight: 'Weight',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            cacheContent: 'string',
            TTL: 'string',
            weight: 'string',
        };
    }
}
exports.SetFileCacheExpiredConfigRequest = SetFileCacheExpiredConfigRequest;
class SetFileCacheExpiredConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetFileCacheExpiredConfigResponseBody = SetFileCacheExpiredConfigResponseBody;
class SetFileCacheExpiredConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetFileCacheExpiredConfigResponseBody,
        };
    }
}
exports.SetFileCacheExpiredConfigResponse = SetFileCacheExpiredConfigResponse;
class SetForceRedirectConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            redirectType: 'RedirectType',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            redirectType: 'string',
        };
    }
}
exports.SetForceRedirectConfigRequest = SetForceRedirectConfigRequest;
class SetForceRedirectConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetForceRedirectConfigResponseBody = SetForceRedirectConfigResponseBody;
class SetForceRedirectConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetForceRedirectConfigResponseBody,
        };
    }
}
exports.SetForceRedirectConfigResponse = SetForceRedirectConfigResponse;
class SetForwardSchemeConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            enable: 'Enable',
            schemeOrigin: 'SchemeOrigin',
            schemeOriginPort: 'SchemeOriginPort',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            enable: 'string',
            schemeOrigin: 'string',
            schemeOriginPort: 'string',
        };
    }
}
exports.SetForwardSchemeConfigRequest = SetForwardSchemeConfigRequest;
class SetForwardSchemeConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetForwardSchemeConfigResponseBody = SetForwardSchemeConfigResponseBody;
class SetForwardSchemeConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetForwardSchemeConfigResponseBody,
        };
    }
}
exports.SetForwardSchemeConfigResponse = SetForwardSchemeConfigResponse;
class SetHttpErrorPageConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            errorCode: 'ErrorCode',
            pageUrl: 'PageUrl',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            errorCode: 'string',
            pageUrl: 'string',
            configId: 'number',
        };
    }
}
exports.SetHttpErrorPageConfigRequest = SetHttpErrorPageConfigRequest;
class SetHttpErrorPageConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetHttpErrorPageConfigResponseBody = SetHttpErrorPageConfigResponseBody;
class SetHttpErrorPageConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetHttpErrorPageConfigResponseBody,
        };
    }
}
exports.SetHttpErrorPageConfigResponse = SetHttpErrorPageConfigResponse;
class SetHttpHeaderConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            headerKey: 'HeaderKey',
            headerValue: 'HeaderValue',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            headerKey: 'string',
            headerValue: 'string',
            configId: 'number',
        };
    }
}
exports.SetHttpHeaderConfigRequest = SetHttpHeaderConfigRequest;
class SetHttpHeaderConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetHttpHeaderConfigResponseBody = SetHttpHeaderConfigResponseBody;
class SetHttpHeaderConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetHttpHeaderConfigResponseBody,
        };
    }
}
exports.SetHttpHeaderConfigResponse = SetHttpHeaderConfigResponse;
class SetHttpsOptionConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            http2: 'Http2',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            http2: 'string',
        };
    }
}
exports.SetHttpsOptionConfigRequest = SetHttpsOptionConfigRequest;
class SetHttpsOptionConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetHttpsOptionConfigResponseBody = SetHttpsOptionConfigResponseBody;
class SetHttpsOptionConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetHttpsOptionConfigResponseBody,
        };
    }
}
exports.SetHttpsOptionConfigResponse = SetHttpsOptionConfigResponse;
class SetIgnoreQueryStringConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            enable: 'Enable',
            hashKeyArgs: 'HashKeyArgs',
            keepOssArgs: 'KeepOssArgs',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            enable: 'string',
            hashKeyArgs: 'string',
            keepOssArgs: 'string',
        };
    }
}
exports.SetIgnoreQueryStringConfigRequest = SetIgnoreQueryStringConfigRequest;
class SetIgnoreQueryStringConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetIgnoreQueryStringConfigResponseBody = SetIgnoreQueryStringConfigResponseBody;
class SetIgnoreQueryStringConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetIgnoreQueryStringConfigResponseBody,
        };
    }
}
exports.SetIgnoreQueryStringConfigResponse = SetIgnoreQueryStringConfigResponse;
class SetIpAllowListConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            allowIps: 'AllowIps',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            allowIps: 'string',
        };
    }
}
exports.SetIpAllowListConfigRequest = SetIpAllowListConfigRequest;
class SetIpAllowListConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetIpAllowListConfigResponseBody = SetIpAllowListConfigResponseBody;
class SetIpAllowListConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetIpAllowListConfigResponseBody,
        };
    }
}
exports.SetIpAllowListConfigResponse = SetIpAllowListConfigResponse;
class SetIpBlackListConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            blockIps: 'BlockIps',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            blockIps: 'string',
            configId: 'number',
        };
    }
}
exports.SetIpBlackListConfigRequest = SetIpBlackListConfigRequest;
class SetIpBlackListConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetIpBlackListConfigResponseBody = SetIpBlackListConfigResponseBody;
class SetIpBlackListConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetIpBlackListConfigResponseBody,
        };
    }
}
exports.SetIpBlackListConfigResponse = SetIpBlackListConfigResponse;
class SetOptimizeConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            enable: 'Enable',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            enable: 'string',
        };
    }
}
exports.SetOptimizeConfigRequest = SetOptimizeConfigRequest;
class SetOptimizeConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetOptimizeConfigResponseBody = SetOptimizeConfigResponseBody;
class SetOptimizeConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetOptimizeConfigResponseBody,
        };
    }
}
exports.SetOptimizeConfigResponse = SetOptimizeConfigResponse;
class SetPageCompressConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            enable: 'Enable',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            enable: 'string',
        };
    }
}
exports.SetPageCompressConfigRequest = SetPageCompressConfigRequest;
class SetPageCompressConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetPageCompressConfigResponseBody = SetPageCompressConfigResponseBody;
class SetPageCompressConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetPageCompressConfigResponseBody,
        };
    }
}
exports.SetPageCompressConfigResponse = SetPageCompressConfigResponse;
class SetRangeConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            enable: 'Enable',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            enable: 'string',
            configId: 'number',
        };
    }
}
exports.SetRangeConfigRequest = SetRangeConfigRequest;
class SetRangeConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetRangeConfigResponseBody = SetRangeConfigResponseBody;
class SetRangeConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetRangeConfigResponseBody,
        };
    }
}
exports.SetRangeConfigResponse = SetRangeConfigResponse;
class SetRefererConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            referType: 'ReferType',
            referList: 'ReferList',
            allowEmpty: 'AllowEmpty',
            disableAst: 'DisableAst',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            referType: 'string',
            referList: 'string',
            allowEmpty: 'string',
            disableAst: 'string',
        };
    }
}
exports.SetRefererConfigRequest = SetRefererConfigRequest;
class SetRefererConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetRefererConfigResponseBody = SetRefererConfigResponseBody;
class SetRefererConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetRefererConfigResponseBody,
        };
    }
}
exports.SetRefererConfigResponse = SetRefererConfigResponse;
class SetRemoveQueryStringConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            configId: 'ConfigId',
            aliRemoveArgs: 'AliRemoveArgs',
            keepOssArgs: 'KeepOssArgs',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            configId: 'number',
            aliRemoveArgs: 'string',
            keepOssArgs: 'string',
        };
    }
}
exports.SetRemoveQueryStringConfigRequest = SetRemoveQueryStringConfigRequest;
class SetRemoveQueryStringConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetRemoveQueryStringConfigResponseBody = SetRemoveQueryStringConfigResponseBody;
class SetRemoveQueryStringConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetRemoveQueryStringConfigResponseBody,
        };
    }
}
exports.SetRemoveQueryStringConfigResponse = SetRemoveQueryStringConfigResponse;
class SetReqAuthConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            authType: 'AuthType',
            key1: 'Key1',
            key2: 'Key2',
            timeOut: 'TimeOut',
            authRemoteDesc: 'AuthRemoteDesc',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            authType: 'string',
            key1: 'string',
            key2: 'string',
            timeOut: 'string',
            authRemoteDesc: 'string',
        };
    }
}
exports.SetReqAuthConfigRequest = SetReqAuthConfigRequest;
class SetReqAuthConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetReqAuthConfigResponseBody = SetReqAuthConfigResponseBody;
class SetReqAuthConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetReqAuthConfigResponseBody,
        };
    }
}
exports.SetReqAuthConfigResponse = SetReqAuthConfigResponse;
class SetReqHeaderConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            key: 'Key',
            value: 'Value',
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            key: 'string',
            value: 'string',
            configId: 'number',
        };
    }
}
exports.SetReqHeaderConfigRequest = SetReqHeaderConfigRequest;
class SetReqHeaderConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetReqHeaderConfigResponseBody = SetReqHeaderConfigResponseBody;
class SetReqHeaderConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetReqHeaderConfigResponseBody,
        };
    }
}
exports.SetReqHeaderConfigResponse = SetReqHeaderConfigResponse;
class SetSourceHostConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
            enable: 'Enable',
            backSrcDomain: 'BackSrcDomain',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
            enable: 'string',
            backSrcDomain: 'string',
        };
    }
}
exports.SetSourceHostConfigRequest = SetSourceHostConfigRequest;
class SetSourceHostConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetSourceHostConfigResponseBody = SetSourceHostConfigResponseBody;
class SetSourceHostConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetSourceHostConfigResponseBody,
        };
    }
}
exports.SetSourceHostConfigResponse = SetSourceHostConfigResponse;
class SetWaitingRoomConfigRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            waitUri: 'WaitUri',
            allowPct: 'AllowPct',
            maxTimeWait: 'MaxTimeWait',
            gapTime: 'GapTime',
            waitUrl: 'WaitUrl',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            waitUri: 'string',
            allowPct: 'number',
            maxTimeWait: 'number',
            gapTime: 'number',
            waitUrl: 'string',
        };
    }
}
exports.SetWaitingRoomConfigRequest = SetWaitingRoomConfigRequest;
class SetWaitingRoomConfigResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.SetWaitingRoomConfigResponseBody = SetWaitingRoomConfigResponseBody;
class SetWaitingRoomConfigResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: SetWaitingRoomConfigResponseBody,
        };
    }
}
exports.SetWaitingRoomConfigResponse = SetWaitingRoomConfigResponse;
class StartCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.StartCdnDomainRequest = StartCdnDomainRequest;
class StartCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.StartCdnDomainResponseBody = StartCdnDomainResponseBody;
class StartCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: StartCdnDomainResponseBody,
        };
    }
}
exports.StartCdnDomainResponse = StartCdnDomainResponse;
class StopCdnDomainRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            securityToken: 'SecurityToken',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            securityToken: 'string',
            domainName: 'string',
        };
    }
}
exports.StopCdnDomainRequest = StopCdnDomainRequest;
class StopCdnDomainResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.StopCdnDomainResponseBody = StopCdnDomainResponseBody;
class StopCdnDomainResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: StopCdnDomainResponseBody,
        };
    }
}
exports.StopCdnDomainResponse = StopCdnDomainResponse;
class TagResourcesRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            resourceType: 'ResourceType',
            resourceId: 'ResourceId',
            tag: 'Tag',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            resourceType: 'string',
            resourceId: { 'type': 'array', 'itemType': 'string' },
            tag: { 'type': 'array', 'itemType': TagResourcesRequestTag },
        };
    }
}
exports.TagResourcesRequest = TagResourcesRequest;
class TagResourcesResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.TagResourcesResponseBody = TagResourcesResponseBody;
class TagResourcesResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: TagResourcesResponseBody,
        };
    }
}
exports.TagResourcesResponse = TagResourcesResponse;
class UntagResourcesRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            resourceType: 'ResourceType',
            all: 'All',
            resourceId: 'ResourceId',
            tagKey: 'TagKey',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            resourceType: 'string',
            all: 'boolean',
            resourceId: { 'type': 'array', 'itemType': 'string' },
            tagKey: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.UntagResourcesRequest = UntagResourcesRequest;
class UntagResourcesResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.UntagResourcesResponseBody = UntagResourcesResponseBody;
class UntagResourcesResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: UntagResourcesResponseBody,
        };
    }
}
exports.UntagResourcesResponse = UntagResourcesResponse;
class UpdateFCTriggerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            triggerARN: 'TriggerARN',
            sourceARN: 'SourceARN',
            functionARN: 'FunctionARN',
            roleARN: 'RoleARN',
            notes: 'Notes',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            triggerARN: 'string',
            sourceARN: 'string',
            functionARN: 'string',
            roleARN: 'string',
            notes: 'string',
        };
    }
}
exports.UpdateFCTriggerRequest = UpdateFCTriggerRequest;
class UpdateFCTriggerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
        };
    }
    static types() {
        return {
            requestId: 'string',
        };
    }
}
exports.UpdateFCTriggerResponseBody = UpdateFCTriggerResponseBody;
class UpdateFCTriggerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: UpdateFCTriggerResponseBody,
        };
    }
}
exports.UpdateFCTriggerResponse = UpdateFCTriggerResponse;
class VerifyDomainOwnerRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ownerId: 'OwnerId',
            domainName: 'DomainName',
            verifyType: 'VerifyType',
        };
    }
    static types() {
        return {
            ownerId: 'number',
            domainName: 'string',
            verifyType: 'string',
        };
    }
}
exports.VerifyDomainOwnerRequest = VerifyDomainOwnerRequest;
class VerifyDomainOwnerResponseBody extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            requestId: 'RequestId',
            content: 'Content',
        };
    }
    static types() {
        return {
            requestId: 'string',
            content: 'string',
        };
    }
}
exports.VerifyDomainOwnerResponseBody = VerifyDomainOwnerResponseBody;
class VerifyDomainOwnerResponse extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: VerifyDomainOwnerResponseBody,
        };
    }
}
exports.VerifyDomainOwnerResponse = VerifyDomainOwnerResponse;
class DescribeCdnCertificateListResponseBodyCertificateListModelCertListCert extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            lastTime: 'LastTime',
            fingerprint: 'Fingerprint',
            certName: 'CertName',
            issuer: 'Issuer',
            certId: 'CertId',
            common: 'Common',
        };
    }
    static types() {
        return {
            lastTime: 'number',
            fingerprint: 'string',
            certName: 'string',
            issuer: 'string',
            certId: 'number',
            common: 'string',
        };
    }
}
exports.DescribeCdnCertificateListResponseBodyCertificateListModelCertListCert = DescribeCdnCertificateListResponseBodyCertificateListModelCertListCert;
class DescribeCdnCertificateListResponseBodyCertificateListModelCertList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            cert: 'Cert',
        };
    }
    static types() {
        return {
            cert: { 'type': 'array', 'itemType': DescribeCdnCertificateListResponseBodyCertificateListModelCertListCert },
        };
    }
}
exports.DescribeCdnCertificateListResponseBodyCertificateListModelCertList = DescribeCdnCertificateListResponseBodyCertificateListModelCertList;
class DescribeCdnCertificateListResponseBodyCertificateListModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certList: 'CertList',
            count: 'Count',
        };
    }
    static types() {
        return {
            certList: DescribeCdnCertificateListResponseBodyCertificateListModelCertList,
            count: 'number',
        };
    }
}
exports.DescribeCdnCertificateListResponseBodyCertificateListModel = DescribeCdnCertificateListResponseBodyCertificateListModel;
class DescribeCdnDomainByCertificateResponseBodyCertInfosCertInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certStartTime: 'CertStartTime',
            certExpireTime: 'CertExpireTime',
            certCaIsLegacy: 'CertCaIsLegacy',
            certSubjectCommonName: 'CertSubjectCommonName',
            certType: 'CertType',
            domainNames: 'DomainNames',
            certExpired: 'CertExpired',
            issuer: 'Issuer',
            domainList: 'DomainList',
        };
    }
    static types() {
        return {
            certStartTime: 'string',
            certExpireTime: 'string',
            certCaIsLegacy: 'string',
            certSubjectCommonName: 'string',
            certType: 'string',
            domainNames: 'string',
            certExpired: 'string',
            issuer: 'string',
            domainList: 'string',
        };
    }
}
exports.DescribeCdnDomainByCertificateResponseBodyCertInfosCertInfo = DescribeCdnDomainByCertificateResponseBodyCertInfosCertInfo;
class DescribeCdnDomainByCertificateResponseBodyCertInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfo: 'CertInfo',
        };
    }
    static types() {
        return {
            certInfo: { 'type': 'array', 'itemType': DescribeCdnDomainByCertificateResponseBodyCertInfosCertInfo },
        };
    }
}
exports.DescribeCdnDomainByCertificateResponseBodyCertInfos = DescribeCdnDomainByCertificateResponseBodyCertInfos;
class DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgsFunctionArg extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            argName: 'ArgName',
            argValue: 'ArgValue',
        };
    }
    static types() {
        return {
            argName: 'string',
            argValue: 'string',
        };
    }
}
exports.DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgsFunctionArg = DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgsFunctionArg;
class DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            functionArg: 'FunctionArg',
        };
    }
    static types() {
        return {
            functionArg: { 'type': 'array', 'itemType': DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgsFunctionArg },
        };
    }
}
exports.DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgs = DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgs;
class DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            configId: 'ConfigId',
            functionName: 'FunctionName',
            functionArgs: 'FunctionArgs',
        };
    }
    static types() {
        return {
            status: 'string',
            configId: 'string',
            functionName: 'string',
            functionArgs: DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfigFunctionArgs,
        };
    }
}
exports.DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfig = DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfig;
class DescribeCdnDomainConfigsResponseBodyDomainConfigs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainConfig: 'DomainConfig',
        };
    }
    static types() {
        return {
            domainConfig: { 'type': 'array', 'itemType': DescribeCdnDomainConfigsResponseBodyDomainConfigsDomainConfig },
        };
    }
}
exports.DescribeCdnDomainConfigsResponseBodyDomainConfigs = DescribeCdnDomainConfigsResponseBodyDomainConfigs;
class DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModelsSourceModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            type: 'Type',
            weight: 'Weight',
            enabled: 'Enabled',
            priority: 'Priority',
            port: 'Port',
            content: 'Content',
        };
    }
    static types() {
        return {
            type: 'string',
            weight: 'string',
            enabled: 'string',
            priority: 'string',
            port: 'number',
            content: 'string',
        };
    }
}
exports.DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModelsSourceModel = DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModelsSourceModel;
class DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModels extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            sourceModel: 'SourceModel',
        };
    }
    static types() {
        return {
            sourceModel: { 'type': 'array', 'itemType': DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModelsSourceModel },
        };
    }
}
exports.DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModels = DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModels;
class DescribeCdnDomainDetailResponseBodyGetDomainDetailModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            httpsCname: 'HttpsCname',
            serverCertificateStatus: 'ServerCertificateStatus',
            gmtModified: 'GmtModified',
            domainName: 'DomainName',
            gmtCreated: 'GmtCreated',
            description: 'Description',
            resourceGroupId: 'ResourceGroupId',
            scope: 'Scope',
            domainStatus: 'DomainStatus',
            cname: 'Cname',
            cdnType: 'CdnType',
            sourceModels: 'SourceModels',
        };
    }
    static types() {
        return {
            httpsCname: 'string',
            serverCertificateStatus: 'string',
            gmtModified: 'string',
            domainName: 'string',
            gmtCreated: 'string',
            description: 'string',
            resourceGroupId: 'string',
            scope: 'string',
            domainStatus: 'string',
            cname: 'string',
            cdnType: 'string',
            sourceModels: DescribeCdnDomainDetailResponseBodyGetDomainDetailModelSourceModels,
        };
    }
}
exports.DescribeCdnDomainDetailResponseBodyGetDomainDetailModel = DescribeCdnDomainDetailResponseBodyGetDomainDetailModel;
class DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfosPageInfoDetail extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pageIndex: 'PageIndex',
            pageSize: 'PageSize',
            total: 'Total',
        };
    }
    static types() {
        return {
            pageIndex: 'number',
            pageSize: 'number',
            total: 'number',
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfosPageInfoDetail = DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfosPageInfoDetail;
class DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pageInfoDetail: 'PageInfoDetail',
        };
    }
    static types() {
        return {
            pageInfoDetail: { 'type': 'array', 'itemType': DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfosPageInfoDetail },
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfos = DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfos;
class DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfosLogInfoDetail extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            startTime: 'StartTime',
            logPath: 'LogPath',
            logSize: 'LogSize',
            logName: 'LogName',
        };
    }
    static types() {
        return {
            endTime: 'string',
            startTime: 'string',
            logPath: 'string',
            logSize: 'number',
            logName: 'string',
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfosLogInfoDetail = DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfosLogInfoDetail;
class DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            logInfoDetail: 'LogInfoDetail',
        };
    }
    static types() {
        return {
            logInfoDetail: { 'type': 'array', 'itemType': DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfosLogInfoDetail },
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfos = DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfos;
class DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetail extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pageInfos: 'PageInfos',
            logCount: 'LogCount',
            domainName: 'DomainName',
            logInfos: 'LogInfos',
        };
    }
    static types() {
        return {
            pageInfos: DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailPageInfos,
            logCount: 'number',
            domainName: 'string',
            logInfos: DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetailLogInfos,
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetail = DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetail;
class DescribeCdnDomainLogsResponseBodyDomainLogDetails extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainLogDetail: 'DomainLogDetail',
        };
    }
    static types() {
        return {
            domainLogDetail: { 'type': 'array', 'itemType': DescribeCdnDomainLogsResponseBodyDomainLogDetailsDomainLogDetail },
        };
    }
}
exports.DescribeCdnDomainLogsResponseBodyDomainLogDetails = DescribeCdnDomainLogsResponseBodyDomainLogDetails;
class DescribeCdnDomainStagingConfigResponseBodyDomainConfigsFunctionArgs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            argName: 'ArgName',
            argValue: 'ArgValue',
        };
    }
    static types() {
        return {
            argName: 'string',
            argValue: 'string',
        };
    }
}
exports.DescribeCdnDomainStagingConfigResponseBodyDomainConfigsFunctionArgs = DescribeCdnDomainStagingConfigResponseBodyDomainConfigsFunctionArgs;
class DescribeCdnDomainStagingConfigResponseBodyDomainConfigs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            configId: 'ConfigId',
            functionName: 'FunctionName',
            functionArgs: 'FunctionArgs',
        };
    }
    static types() {
        return {
            status: 'string',
            configId: 'string',
            functionName: 'string',
            functionArgs: { 'type': 'array', 'itemType': DescribeCdnDomainStagingConfigResponseBodyDomainConfigsFunctionArgs },
        };
    }
}
exports.DescribeCdnDomainStagingConfigResponseBodyDomainConfigs = DescribeCdnDomainStagingConfigResponseBodyDomainConfigs;
class DescribeCdnHttpsDomainListResponseBodyCertInfosCertInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certStartTime: 'CertStartTime',
            certExpireTime: 'CertExpireTime',
            certUpdateTime: 'CertUpdateTime',
            certType: 'CertType',
            certName: 'CertName',
            certStatus: 'CertStatus',
            domainName: 'DomainName',
            certCommonName: 'CertCommonName',
        };
    }
    static types() {
        return {
            certStartTime: 'string',
            certExpireTime: 'string',
            certUpdateTime: 'string',
            certType: 'string',
            certName: 'string',
            certStatus: 'string',
            domainName: 'string',
            certCommonName: 'string',
        };
    }
}
exports.DescribeCdnHttpsDomainListResponseBodyCertInfosCertInfo = DescribeCdnHttpsDomainListResponseBodyCertInfosCertInfo;
class DescribeCdnHttpsDomainListResponseBodyCertInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfo: 'CertInfo',
        };
    }
    static types() {
        return {
            certInfo: { 'type': 'array', 'itemType': DescribeCdnHttpsDomainListResponseBodyCertInfosCertInfo },
        };
    }
}
exports.DescribeCdnHttpsDomainListResponseBodyCertInfos = DescribeCdnHttpsDomainListResponseBodyCertInfos;
class DescribeCdnRegionAndIspResponseBodyRegionsRegion extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            nameEn: 'NameEn',
            nameZh: 'NameZh',
        };
    }
    static types() {
        return {
            nameEn: 'string',
            nameZh: 'string',
        };
    }
}
exports.DescribeCdnRegionAndIspResponseBodyRegionsRegion = DescribeCdnRegionAndIspResponseBodyRegionsRegion;
class DescribeCdnRegionAndIspResponseBodyRegions extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            region: 'Region',
        };
    }
    static types() {
        return {
            region: { 'type': 'array', 'itemType': DescribeCdnRegionAndIspResponseBodyRegionsRegion },
        };
    }
}
exports.DescribeCdnRegionAndIspResponseBodyRegions = DescribeCdnRegionAndIspResponseBodyRegions;
class DescribeCdnRegionAndIspResponseBodyIspsIsp extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            nameEn: 'NameEn',
            nameZh: 'NameZh',
        };
    }
    static types() {
        return {
            nameEn: 'string',
            nameZh: 'string',
        };
    }
}
exports.DescribeCdnRegionAndIspResponseBodyIspsIsp = DescribeCdnRegionAndIspResponseBodyIspsIsp;
class DescribeCdnRegionAndIspResponseBodyIsps extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            isp: 'Isp',
        };
    }
    static types() {
        return {
            isp: { 'type': 'array', 'itemType': DescribeCdnRegionAndIspResponseBodyIspsIsp },
        };
    }
}
exports.DescribeCdnRegionAndIspResponseBodyIsps = DescribeCdnRegionAndIspResponseBodyIsps;
class DescribeCdnServiceResponseBodyOperationLocksLockReason extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            lockReason: 'LockReason',
        };
    }
    static types() {
        return {
            lockReason: 'string',
        };
    }
}
exports.DescribeCdnServiceResponseBodyOperationLocksLockReason = DescribeCdnServiceResponseBodyOperationLocksLockReason;
class DescribeCdnServiceResponseBodyOperationLocks extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            lockReason: 'LockReason',
        };
    }
    static types() {
        return {
            lockReason: { 'type': 'array', 'itemType': DescribeCdnServiceResponseBodyOperationLocksLockReason },
        };
    }
}
exports.DescribeCdnServiceResponseBodyOperationLocks = DescribeCdnServiceResponseBodyOperationLocks;
class DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingDataBillingDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            bandwidth: 'Bandwidth',
            chargeType: 'ChargeType',
            flow: 'Flow',
            count: 'Count',
            cdnRegion: 'CdnRegion',
        };
    }
    static types() {
        return {
            bandwidth: 'number',
            chargeType: 'string',
            flow: 'number',
            count: 'number',
            cdnRegion: 'string',
        };
    }
}
exports.DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingDataBillingDataItem = DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingDataBillingDataItem;
class DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billingDataItem: 'BillingDataItem',
        };
    }
    static types() {
        return {
            billingDataItem: { 'type': 'array', 'itemType': DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingDataBillingDataItem },
        };
    }
}
exports.DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingData = DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingData;
class DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billingData: 'BillingData',
            billType: 'BillType',
            dimension: 'Dimension',
            billTime: 'BillTime',
        };
    }
    static types() {
        return {
            billingData: DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItemBillingData,
            billType: 'string',
            dimension: 'string',
            billTime: 'string',
        };
    }
}
exports.DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItem = DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItem;
class DescribeCdnUserBillHistoryResponseBodyBillHistoryData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billHistoryDataItem: 'BillHistoryDataItem',
        };
    }
    static types() {
        return {
            billHistoryDataItem: { 'type': 'array', 'itemType': DescribeCdnUserBillHistoryResponseBodyBillHistoryDataBillHistoryDataItem },
        };
    }
}
exports.DescribeCdnUserBillHistoryResponseBodyBillHistoryData = DescribeCdnUserBillHistoryResponseBodyBillHistoryData;
class DescribeCdnUserBillPredictionResponseBodyBillPredictionDataBillPredictionDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStp: 'TimeStp',
            area: 'Area',
        };
    }
    static types() {
        return {
            value: 'number',
            timeStp: 'string',
            area: 'string',
        };
    }
}
exports.DescribeCdnUserBillPredictionResponseBodyBillPredictionDataBillPredictionDataItem = DescribeCdnUserBillPredictionResponseBodyBillPredictionDataBillPredictionDataItem;
class DescribeCdnUserBillPredictionResponseBodyBillPredictionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billPredictionDataItem: 'BillPredictionDataItem',
        };
    }
    static types() {
        return {
            billPredictionDataItem: { 'type': 'array', 'itemType': DescribeCdnUserBillPredictionResponseBodyBillPredictionDataBillPredictionDataItem },
        };
    }
}
exports.DescribeCdnUserBillPredictionResponseBodyBillPredictionData = DescribeCdnUserBillPredictionResponseBodyBillPredictionData;
class DescribeCdnUserBillTypeResponseBodyBillTypeDataBillTypeDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            startTime: 'StartTime',
            billingCycle: 'BillingCycle',
            product: 'Product',
            billType: 'BillType',
            dimension: 'Dimension',
        };
    }
    static types() {
        return {
            endTime: 'string',
            startTime: 'string',
            billingCycle: 'string',
            product: 'string',
            billType: 'string',
            dimension: 'string',
        };
    }
}
exports.DescribeCdnUserBillTypeResponseBodyBillTypeDataBillTypeDataItem = DescribeCdnUserBillTypeResponseBodyBillTypeDataBillTypeDataItem;
class DescribeCdnUserBillTypeResponseBodyBillTypeData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            billTypeDataItem: 'BillTypeDataItem',
        };
    }
    static types() {
        return {
            billTypeDataItem: { 'type': 'array', 'itemType': DescribeCdnUserBillTypeResponseBodyBillTypeDataBillTypeDataItem },
        };
    }
}
exports.DescribeCdnUserBillTypeResponseBodyBillTypeData = DescribeCdnUserBillTypeResponseBodyBillTypeData;
class DescribeCdnUserConfigsResponseBodyConfigs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            argName: 'ArgName',
            functionName: 'FunctionName',
            argValue: 'ArgValue',
        };
    }
    static types() {
        return {
            argName: 'string',
            functionName: 'string',
            argValue: 'string',
        };
    }
}
exports.DescribeCdnUserConfigsResponseBodyConfigs = DescribeCdnUserConfigsResponseBodyConfigs;
class DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSourcesSource extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            type: 'Type',
            weight: 'Weight',
            priority: 'Priority',
            port: 'Port',
            content: 'Content',
        };
    }
    static types() {
        return {
            type: 'string',
            weight: 'string',
            priority: 'string',
            port: 'number',
            content: 'string',
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSourcesSource = DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSourcesSource;
class DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSources extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            source: 'Source',
        };
    }
    static types() {
        return {
            source: { 'type': 'array', 'itemType': DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSourcesSource },
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSources = DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSources;
class DescribeCdnUserDomainsByFuncResponseBodyDomainsPageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            gmtCreated: 'GmtCreated',
            sslProtocol: 'SslProtocol',
            description: 'Description',
            resourceGroupId: 'ResourceGroupId',
            sandbox: 'Sandbox',
            domainStatus: 'DomainStatus',
            cname: 'Cname',
            sources: 'Sources',
            gmtModified: 'GmtModified',
            cdnType: 'CdnType',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            gmtCreated: 'string',
            sslProtocol: 'string',
            description: 'string',
            resourceGroupId: 'string',
            sandbox: 'string',
            domainStatus: 'string',
            cname: 'string',
            sources: DescribeCdnUserDomainsByFuncResponseBodyDomainsPageDataSources,
            gmtModified: 'string',
            cdnType: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponseBodyDomainsPageData = DescribeCdnUserDomainsByFuncResponseBodyDomainsPageData;
class DescribeCdnUserDomainsByFuncResponseBodyDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pageData: 'PageData',
        };
    }
    static types() {
        return {
            pageData: { 'type': 'array', 'itemType': DescribeCdnUserDomainsByFuncResponseBodyDomainsPageData },
        };
    }
}
exports.DescribeCdnUserDomainsByFuncResponseBodyDomains = DescribeCdnUserDomainsByFuncResponseBodyDomains;
class DescribeCdnUserResourcePackageResponseBodyResourcePackageInfosResourcePackageInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            status: 'Status',
            displayName: 'DisplayName',
            startTime: 'StartTime',
            commodityCode: 'CommodityCode',
            currCapacity: 'CurrCapacity',
            initCapacity: 'InitCapacity',
            instanceId: 'InstanceId',
            templateName: 'TemplateName',
        };
    }
    static types() {
        return {
            endTime: 'string',
            status: 'string',
            displayName: 'string',
            startTime: 'string',
            commodityCode: 'string',
            currCapacity: 'string',
            initCapacity: 'string',
            instanceId: 'string',
            templateName: 'string',
        };
    }
}
exports.DescribeCdnUserResourcePackageResponseBodyResourcePackageInfosResourcePackageInfo = DescribeCdnUserResourcePackageResponseBodyResourcePackageInfosResourcePackageInfo;
class DescribeCdnUserResourcePackageResponseBodyResourcePackageInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            resourcePackageInfo: 'ResourcePackageInfo',
        };
    }
    static types() {
        return {
            resourcePackageInfo: { 'type': 'array', 'itemType': DescribeCdnUserResourcePackageResponseBodyResourcePackageInfosResourcePackageInfo },
        };
    }
}
exports.DescribeCdnUserResourcePackageResponseBodyResourcePackageInfos = DescribeCdnUserResourcePackageResponseBodyResourcePackageInfos;
class DescribeCdnWafDomainResponseBodyOutPutDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            domain: 'Domain',
            ccStatus: 'CcStatus',
            aclStatus: 'AclStatus',
            wafStatus: 'WafStatus',
        };
    }
    static types() {
        return {
            status: 'string',
            domain: 'string',
            ccStatus: 'string',
            aclStatus: 'string',
            wafStatus: 'string',
        };
    }
}
exports.DescribeCdnWafDomainResponseBodyOutPutDomains = DescribeCdnWafDomainResponseBodyOutPutDomains;
class DescribeCertificateInfoByIDResponseBodyCertInfosCertInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certExpireTime: 'CertExpireTime',
            createTime: 'CreateTime',
            certType: 'CertType',
            certName: 'CertName',
            certId: 'CertId',
            domainList: 'DomainList',
            httpsCrt: 'HttpsCrt',
        };
    }
    static types() {
        return {
            certExpireTime: 'string',
            createTime: 'string',
            certType: 'string',
            certName: 'string',
            certId: 'string',
            domainList: 'string',
            httpsCrt: 'string',
        };
    }
}
exports.DescribeCertificateInfoByIDResponseBodyCertInfosCertInfo = DescribeCertificateInfoByIDResponseBodyCertInfosCertInfo;
class DescribeCertificateInfoByIDResponseBodyCertInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfo: 'CertInfo',
        };
    }
    static types() {
        return {
            certInfo: { 'type': 'array', 'itemType': DescribeCertificateInfoByIDResponseBodyCertInfosCertInfo },
        };
    }
}
exports.DescribeCertificateInfoByIDResponseBodyCertInfos = DescribeCertificateInfoByIDResponseBodyCertInfos;
class DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgsFunctionArg extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            argName: 'ArgName',
            argValue: 'ArgValue',
        };
    }
    static types() {
        return {
            argName: 'string',
            argValue: 'string',
        };
    }
}
exports.DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgsFunctionArg = DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgsFunctionArg;
class DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            functionArg: 'FunctionArg',
        };
    }
    static types() {
        return {
            functionArg: { 'type': 'array', 'itemType': DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgsFunctionArg },
        };
    }
}
exports.DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgs = DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgs;
class DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            configId: 'ConfigId',
            functionName: 'FunctionName',
            functionArgs: 'FunctionArgs',
        };
    }
    static types() {
        return {
            status: 'string',
            configId: 'string',
            functionName: 'string',
            functionArgs: DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfigFunctionArgs,
        };
    }
}
exports.DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfig = DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfig;
class DescribeConfigOfVersionResponseBodyVersionConfigs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            versionConfig: 'VersionConfig',
        };
    }
    static types() {
        return {
            versionConfig: { 'type': 'array', 'itemType': DescribeConfigOfVersionResponseBodyVersionConfigsVersionConfig },
        };
    }
}
exports.DescribeConfigOfVersionResponseBodyVersionConfigs = DescribeConfigOfVersionResponseBodyVersionConfigs;
class DescribeDomainAverageResponseTimeResponseBodyAvgRTPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainAverageResponseTimeResponseBodyAvgRTPerIntervalDataModule = DescribeDomainAverageResponseTimeResponseBodyAvgRTPerIntervalDataModule;
class DescribeDomainAverageResponseTimeResponseBodyAvgRTPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainAverageResponseTimeResponseBodyAvgRTPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainAverageResponseTimeResponseBodyAvgRTPerInterval = DescribeDomainAverageResponseTimeResponseBodyAvgRTPerInterval;
class DescribeDomainBpsDataResponseBodyBpsDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            httpsDomesticValue: 'HttpsDomesticValue',
            value: 'Value',
            overseasValue: 'OverseasValue',
            httpsValue: 'HttpsValue',
            httpsOverseasValue: 'HttpsOverseasValue',
            timeStamp: 'TimeStamp',
            domesticValue: 'DomesticValue',
        };
    }
    static types() {
        return {
            httpsDomesticValue: 'string',
            value: 'string',
            overseasValue: 'string',
            httpsValue: 'string',
            httpsOverseasValue: 'string',
            timeStamp: 'string',
            domesticValue: 'string',
        };
    }
}
exports.DescribeDomainBpsDataResponseBodyBpsDataPerIntervalDataModule = DescribeDomainBpsDataResponseBodyBpsDataPerIntervalDataModule;
class DescribeDomainBpsDataResponseBodyBpsDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainBpsDataResponseBodyBpsDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainBpsDataResponseBodyBpsDataPerInterval = DescribeDomainBpsDataResponseBodyBpsDataPerInterval;
class DescribeDomainBpsDataByLayerResponseBodyBpsDataIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            trafficValue: 'TrafficValue',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            trafficValue: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainBpsDataByLayerResponseBodyBpsDataIntervalDataModule = DescribeDomainBpsDataByLayerResponseBodyBpsDataIntervalDataModule;
class DescribeDomainBpsDataByLayerResponseBodyBpsDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainBpsDataByLayerResponseBodyBpsDataIntervalDataModule },
        };
    }
}
exports.DescribeDomainBpsDataByLayerResponseBodyBpsDataInterval = DescribeDomainBpsDataByLayerResponseBodyBpsDataInterval;
class DescribeDomainBpsDataByTimeStampResponseBodyBpsDataListBpsDataModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            locationName: 'LocationName',
            timeStamp: 'TimeStamp',
            ispName: 'IspName',
            bps: 'Bps',
        };
    }
    static types() {
        return {
            locationName: 'string',
            timeStamp: 'string',
            ispName: 'string',
            bps: 'number',
        };
    }
}
exports.DescribeDomainBpsDataByTimeStampResponseBodyBpsDataListBpsDataModel = DescribeDomainBpsDataByTimeStampResponseBodyBpsDataListBpsDataModel;
class DescribeDomainBpsDataByTimeStampResponseBodyBpsDataList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            bpsDataModel: 'BpsDataModel',
        };
    }
    static types() {
        return {
            bpsDataModel: { 'type': 'array', 'itemType': DescribeDomainBpsDataByTimeStampResponseBodyBpsDataListBpsDataModel },
        };
    }
}
exports.DescribeDomainBpsDataByTimeStampResponseBodyBpsDataList = DescribeDomainBpsDataByTimeStampResponseBodyBpsDataList;
class DescribeDomainCcActivityLogResponseBodyActivityLog extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            ttl: 'Ttl',
            action: 'Action',
            triggerObject: 'TriggerObject',
            timeStamp: 'TimeStamp',
            domainName: 'DomainName',
            ruleName: 'RuleName',
        };
    }
    static types() {
        return {
            value: 'string',
            ttl: 'number',
            action: 'string',
            triggerObject: 'string',
            timeStamp: 'string',
            domainName: 'string',
            ruleName: 'string',
        };
    }
}
exports.DescribeDomainCcActivityLogResponseBodyActivityLog = DescribeDomainCcActivityLogResponseBodyActivityLog;
class DescribeDomainCertificateInfoResponseBodyCertInfosCertInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            certLife: 'CertLife',
            certExpireTime: 'CertExpireTime',
            certUpdateTime: 'CertUpdateTime',
            serverCertificateStatus: 'ServerCertificateStatus',
            certDomainName: 'CertDomainName',
            certOrg: 'CertOrg',
            domainName: 'DomainName',
            certStartTime: 'CertStartTime',
            certType: 'CertType',
            certName: 'CertName',
            domainCnameStatus: 'DomainCnameStatus',
            serverCertificate: 'ServerCertificate',
        };
    }
    static types() {
        return {
            status: 'string',
            certLife: 'string',
            certExpireTime: 'string',
            certUpdateTime: 'string',
            serverCertificateStatus: 'string',
            certDomainName: 'string',
            certOrg: 'string',
            domainName: 'string',
            certStartTime: 'string',
            certType: 'string',
            certName: 'string',
            domainCnameStatus: 'string',
            serverCertificate: 'string',
        };
    }
}
exports.DescribeDomainCertificateInfoResponseBodyCertInfosCertInfo = DescribeDomainCertificateInfoResponseBodyCertInfosCertInfo;
class DescribeDomainCertificateInfoResponseBodyCertInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            certInfo: 'CertInfo',
        };
    }
    static types() {
        return {
            certInfo: { 'type': 'array', 'itemType': DescribeDomainCertificateInfoResponseBodyCertInfosCertInfo },
        };
    }
}
exports.DescribeDomainCertificateInfoResponseBodyCertInfos = DescribeDomainCertificateInfoResponseBodyCertInfos;
class DescribeDomainDetailDataByLayerResponseBodyDataDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            traf: 'Traf',
            qps: 'Qps',
            ipv6Qps: 'Ipv6Qps',
            ipv6Bps: 'Ipv6Bps',
            acc: 'Acc',
            ipv6Traf: 'Ipv6Traf',
            ipv6Acc: 'Ipv6Acc',
            timeStamp: 'TimeStamp',
            httpCode: 'HttpCode',
            bps: 'Bps',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            traf: 'number',
            qps: 'number',
            ipv6Qps: 'number',
            ipv6Bps: 'number',
            acc: 'number',
            ipv6Traf: 'number',
            ipv6Acc: 'number',
            timeStamp: 'string',
            httpCode: 'string',
            bps: 'number',
            domainName: 'string',
        };
    }
}
exports.DescribeDomainDetailDataByLayerResponseBodyDataDataModule = DescribeDomainDetailDataByLayerResponseBodyDataDataModule;
class DescribeDomainDetailDataByLayerResponseBodyData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainDetailDataByLayerResponseBodyDataDataModule },
        };
    }
}
exports.DescribeDomainDetailDataByLayerResponseBodyData = DescribeDomainDetailDataByLayerResponseBodyData;
class DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValueFileSizeProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            proportion: 'Proportion',
            fileSize: 'FileSize',
        };
    }
    static types() {
        return {
            proportion: 'string',
            fileSize: 'string',
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValueFileSizeProportionData = DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValueFileSizeProportionData;
class DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            fileSizeProportionData: 'FileSizeProportionData',
        };
    }
    static types() {
        return {
            fileSizeProportionData: { 'type': 'array', 'itemType': DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValueFileSizeProportionData },
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValue = DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValue;
class DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageDataValue,
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageData = DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageData;
class DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataIntervalUsageData },
        };
    }
}
exports.DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataInterval = DescribeDomainFileSizeProportionDataResponseBodyFileSizeProportionDataInterval;
class DescribeDomainHitRateDataResponseBodyHitRateIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            httpsValue: 'HttpsValue',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            httpsValue: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainHitRateDataResponseBodyHitRateIntervalDataModule = DescribeDomainHitRateDataResponseBodyHitRateIntervalDataModule;
class DescribeDomainHitRateDataResponseBodyHitRateInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainHitRateDataResponseBodyHitRateIntervalDataModule },
        };
    }
}
exports.DescribeDomainHitRateDataResponseBodyHitRateInterval = DescribeDomainHitRateDataResponseBodyHitRateInterval;
class DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            code: 'Code',
            proportion: 'Proportion',
            count: 'Count',
        };
    }
    static types() {
        return {
            code: 'string',
            proportion: 'string',
            count: 'string',
        };
    }
}
exports.DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData = DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData;
class DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            codeProportionData: 'CodeProportionData',
        };
    }
    static types() {
        return {
            codeProportionData: { 'type': 'array', 'itemType': DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData },
        };
    }
}
exports.DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValue = DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValue;
class DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageDataValue,
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageData = DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageData;
class DescribeDomainHttpCodeDataResponseBodyHttpCodeData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainHttpCodeDataResponseBodyHttpCodeDataUsageData },
        };
    }
}
exports.DescribeDomainHttpCodeDataResponseBodyHttpCodeData = DescribeDomainHttpCodeDataResponseBodyHttpCodeData;
class DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
            totalValue: 'TotalValue',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
            totalValue: 'string',
        };
    }
}
exports.DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataIntervalDataModule = DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataIntervalDataModule;
class DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataIntervalDataModule },
        };
    }
}
exports.DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataInterval = DescribeDomainHttpCodeDataByLayerResponseBodyHttpCodeDataInterval;
class DescribeDomainISPDataResponseBodyValueISPProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalQuery: 'TotalQuery',
            totalBytes: 'TotalBytes',
            avgResponseRate: 'AvgResponseRate',
            avgResponseTime: 'AvgResponseTime',
            reqErrRate: 'ReqErrRate',
            avgObjectSize: 'AvgObjectSize',
            bps: 'Bps',
            qps: 'Qps',
            proportion: 'Proportion',
            ispEname: 'IspEname',
            ISP: 'ISP',
            bytesProportion: 'BytesProportion',
        };
    }
    static types() {
        return {
            totalQuery: 'string',
            totalBytes: 'string',
            avgResponseRate: 'string',
            avgResponseTime: 'string',
            reqErrRate: 'string',
            avgObjectSize: 'string',
            bps: 'string',
            qps: 'string',
            proportion: 'string',
            ispEname: 'string',
            ISP: 'string',
            bytesProportion: 'string',
        };
    }
}
exports.DescribeDomainISPDataResponseBodyValueISPProportionData = DescribeDomainISPDataResponseBodyValueISPProportionData;
class DescribeDomainISPDataResponseBodyValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ISPProportionData: 'ISPProportionData',
        };
    }
    static types() {
        return {
            ISPProportionData: { 'type': 'array', 'itemType': DescribeDomainISPDataResponseBodyValueISPProportionData },
        };
    }
}
exports.DescribeDomainISPDataResponseBodyValue = DescribeDomainISPDataResponseBodyValue;
class DescribeDomainNamesOfVersionResponseBodyContents extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainName: 'DomainName',
            domainId: 'DomainId',
        };
    }
    static types() {
        return {
            domainName: 'string',
            domainId: 'string',
        };
    }
}
exports.DescribeDomainNamesOfVersionResponseBodyContents = DescribeDomainNamesOfVersionResponseBodyContents;
class DescribeDomainPathDataResponseBodyPathDataPerIntervalUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            time: 'Time',
            acc: 'Acc',
            traffic: 'Traffic',
            path: 'Path',
        };
    }
    static types() {
        return {
            time: 'string',
            acc: 'number',
            traffic: 'number',
            path: 'string',
        };
    }
}
exports.DescribeDomainPathDataResponseBodyPathDataPerIntervalUsageData = DescribeDomainPathDataResponseBodyPathDataPerIntervalUsageData;
class DescribeDomainPathDataResponseBodyPathDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainPathDataResponseBodyPathDataPerIntervalUsageData },
        };
    }
}
exports.DescribeDomainPathDataResponseBodyPathDataPerInterval = DescribeDomainPathDataResponseBodyPathDataPerInterval;
class DescribeDomainPvDataResponseBodyPvDataIntervalUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainPvDataResponseBodyPvDataIntervalUsageData = DescribeDomainPvDataResponseBodyPvDataIntervalUsageData;
class DescribeDomainPvDataResponseBodyPvDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainPvDataResponseBodyPvDataIntervalUsageData },
        };
    }
}
exports.DescribeDomainPvDataResponseBodyPvDataInterval = DescribeDomainPvDataResponseBodyPvDataInterval;
class DescribeDomainQpsDataResponseBodyQpsDataIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accValue: 'AccValue',
            accDomesticValue: 'AccDomesticValue',
            httpsValue: 'HttpsValue',
            accOverseasValue: 'AccOverseasValue',
            httpsOverseasValue: 'HttpsOverseasValue',
            domesticValue: 'DomesticValue',
            httpsAccOverseasValue: 'HttpsAccOverseasValue',
            httpsAccValue: 'HttpsAccValue',
            httpsDomesticValue: 'HttpsDomesticValue',
            value: 'Value',
            overseasValue: 'OverseasValue',
            timeStamp: 'TimeStamp',
            httpsAccDomesticValue: 'HttpsAccDomesticValue',
        };
    }
    static types() {
        return {
            accValue: 'string',
            accDomesticValue: 'string',
            httpsValue: 'string',
            accOverseasValue: 'string',
            httpsOverseasValue: 'string',
            domesticValue: 'string',
            httpsAccOverseasValue: 'string',
            httpsAccValue: 'string',
            httpsDomesticValue: 'string',
            value: 'string',
            overseasValue: 'string',
            timeStamp: 'string',
            httpsAccDomesticValue: 'string',
        };
    }
}
exports.DescribeDomainQpsDataResponseBodyQpsDataIntervalDataModule = DescribeDomainQpsDataResponseBodyQpsDataIntervalDataModule;
class DescribeDomainQpsDataResponseBodyQpsDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainQpsDataResponseBodyQpsDataIntervalDataModule },
        };
    }
}
exports.DescribeDomainQpsDataResponseBodyQpsDataInterval = DescribeDomainQpsDataResponseBodyQpsDataInterval;
class DescribeDomainQpsDataByLayerResponseBodyQpsDataIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            accValue: 'AccValue',
            accDomesticValue: 'AccDomesticValue',
            overseasValue: 'OverseasValue',
            accOverseasValue: 'AccOverseasValue',
            timeStamp: 'TimeStamp',
            domesticValue: 'DomesticValue',
        };
    }
    static types() {
        return {
            value: 'string',
            accValue: 'string',
            accDomesticValue: 'string',
            overseasValue: 'string',
            accOverseasValue: 'string',
            timeStamp: 'string',
            domesticValue: 'string',
        };
    }
}
exports.DescribeDomainQpsDataByLayerResponseBodyQpsDataIntervalDataModule = DescribeDomainQpsDataByLayerResponseBodyQpsDataIntervalDataModule;
class DescribeDomainQpsDataByLayerResponseBodyQpsDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainQpsDataByLayerResponseBodyQpsDataIntervalDataModule },
        };
    }
}
exports.DescribeDomainQpsDataByLayerResponseBodyQpsDataInterval = DescribeDomainQpsDataByLayerResponseBodyQpsDataInterval;
class DescribeDomainRealTimeBpsDataResponseBodyDataBpsModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            timeStamp: 'TimeStamp',
            bps: 'Bps',
        };
    }
    static types() {
        return {
            timeStamp: 'string',
            bps: 'number',
        };
    }
}
exports.DescribeDomainRealTimeBpsDataResponseBodyDataBpsModel = DescribeDomainRealTimeBpsDataResponseBodyDataBpsModel;
class DescribeDomainRealTimeBpsDataResponseBodyData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            bpsModel: 'BpsModel',
        };
    }
    static types() {
        return {
            bpsModel: { 'type': 'array', 'itemType': DescribeDomainRealTimeBpsDataResponseBodyDataBpsModel },
        };
    }
}
exports.DescribeDomainRealTimeBpsDataResponseBodyData = DescribeDomainRealTimeBpsDataResponseBodyData;
class DescribeDomainRealTimeByteHitRateDataResponseBodyDataByteHitRateDataModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            byteHitRate: 'ByteHitRate',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            byteHitRate: 'number',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeByteHitRateDataResponseBodyDataByteHitRateDataModel = DescribeDomainRealTimeByteHitRateDataResponseBodyDataByteHitRateDataModel;
class DescribeDomainRealTimeByteHitRateDataResponseBodyData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            byteHitRateDataModel: 'ByteHitRateDataModel',
        };
    }
    static types() {
        return {
            byteHitRateDataModel: { 'type': 'array', 'itemType': DescribeDomainRealTimeByteHitRateDataResponseBodyDataByteHitRateDataModel },
        };
    }
}
exports.DescribeDomainRealTimeByteHitRateDataResponseBodyData = DescribeDomainRealTimeByteHitRateDataResponseBodyData;
class DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValueRealTimeCodeProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            code: 'Code',
            proportion: 'Proportion',
            count: 'Count',
        };
    }
    static types() {
        return {
            code: 'string',
            proportion: 'string',
            count: 'string',
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValueRealTimeCodeProportionData = DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValueRealTimeCodeProportionData;
class DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            realTimeCodeProportionData: 'RealTimeCodeProportionData',
        };
    }
    static types() {
        return {
            realTimeCodeProportionData: { 'type': 'array', 'itemType': DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValueRealTimeCodeProportionData },
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValue = DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValue;
class DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageDataValue,
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageData = DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageData;
class DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeDataUsageData },
        };
    }
}
exports.DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeData = DescribeDomainRealTimeHttpCodeDataResponseBodyRealTimeHttpCodeData;
class DescribeDomainRealTimeQpsDataResponseBodyDataQpsModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            qps: 'Qps',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            qps: 'number',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeQpsDataResponseBodyDataQpsModel = DescribeDomainRealTimeQpsDataResponseBodyDataQpsModel;
class DescribeDomainRealTimeQpsDataResponseBodyData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            qpsModel: 'QpsModel',
        };
    }
    static types() {
        return {
            qpsModel: { 'type': 'array', 'itemType': DescribeDomainRealTimeQpsDataResponseBodyDataQpsModel },
        };
    }
}
exports.DescribeDomainRealTimeQpsDataResponseBodyData = DescribeDomainRealTimeQpsDataResponseBodyData;
class DescribeDomainRealTimeReqHitRateDataResponseBodyDataReqHitRateDataModel extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            reqHitRate: 'ReqHitRate',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            reqHitRate: 'number',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeReqHitRateDataResponseBodyDataReqHitRateDataModel = DescribeDomainRealTimeReqHitRateDataResponseBodyDataReqHitRateDataModel;
class DescribeDomainRealTimeReqHitRateDataResponseBodyData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            reqHitRateDataModel: 'ReqHitRateDataModel',
        };
    }
    static types() {
        return {
            reqHitRateDataModel: { 'type': 'array', 'itemType': DescribeDomainRealTimeReqHitRateDataResponseBodyDataReqHitRateDataModel },
        };
    }
}
exports.DescribeDomainRealTimeReqHitRateDataResponseBodyData = DescribeDomainRealTimeReqHitRateDataResponseBodyData;
class DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerIntervalDataModule = DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerIntervalDataModule;
class DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerInterval = DescribeDomainRealTimeSrcBpsDataResponseBodyRealTimeSrcBpsDataPerInterval;
class DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValueRealTimeSrcCodeProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            code: 'Code',
            proportion: 'Proportion',
            count: 'Count',
        };
    }
    static types() {
        return {
            code: 'string',
            proportion: 'string',
            count: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValueRealTimeSrcCodeProportionData = DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValueRealTimeSrcCodeProportionData;
class DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            realTimeSrcCodeProportionData: 'RealTimeSrcCodeProportionData',
        };
    }
    static types() {
        return {
            realTimeSrcCodeProportionData: { 'type': 'array', 'itemType': DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValueRealTimeSrcCodeProportionData },
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValue = DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValue;
class DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageDataValue,
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageData = DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageData;
class DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeDataUsageData },
        };
    }
}
exports.DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeData = DescribeDomainRealTimeSrcHttpCodeDataResponseBodyRealTimeSrcHttpCodeData;
class DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerIntervalDataModule = DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerIntervalDataModule;
class DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerInterval = DescribeDomainRealTimeSrcTrafficDataResponseBodyRealTimeSrcTrafficDataPerInterval;
class DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerIntervalDataModule = DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerIntervalDataModule;
class DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerInterval = DescribeDomainRealTimeTrafficDataResponseBodyRealTimeTrafficDataPerInterval;
class DescribeDomainRegionDataResponseBodyValueRegionProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            totalQuery: 'TotalQuery',
            totalBytes: 'TotalBytes',
            avgResponseRate: 'AvgResponseRate',
            avgResponseTime: 'AvgResponseTime',
            reqErrRate: 'ReqErrRate',
            avgObjectSize: 'AvgObjectSize',
            bps: 'Bps',
            qps: 'Qps',
            regionEname: 'RegionEname',
            region: 'Region',
            proportion: 'Proportion',
            bytesProportion: 'BytesProportion',
        };
    }
    static types() {
        return {
            totalQuery: 'string',
            totalBytes: 'string',
            avgResponseRate: 'string',
            avgResponseTime: 'string',
            reqErrRate: 'string',
            avgObjectSize: 'string',
            bps: 'string',
            qps: 'string',
            regionEname: 'string',
            region: 'string',
            proportion: 'string',
            bytesProportion: 'string',
        };
    }
}
exports.DescribeDomainRegionDataResponseBodyValueRegionProportionData = DescribeDomainRegionDataResponseBodyValueRegionProportionData;
class DescribeDomainRegionDataResponseBodyValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            regionProportionData: 'RegionProportionData',
        };
    }
    static types() {
        return {
            regionProportionData: { 'type': 'array', 'itemType': DescribeDomainRegionDataResponseBodyValueRegionProportionData },
        };
    }
}
exports.DescribeDomainRegionDataResponseBodyValue = DescribeDomainRegionDataResponseBodyValue;
class DescribeDomainReqHitRateDataResponseBodyReqHitRateIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            httpsValue: 'HttpsValue',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            httpsValue: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainReqHitRateDataResponseBodyReqHitRateIntervalDataModule = DescribeDomainReqHitRateDataResponseBodyReqHitRateIntervalDataModule;
class DescribeDomainReqHitRateDataResponseBodyReqHitRateInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainReqHitRateDataResponseBodyReqHitRateIntervalDataModule },
        };
    }
}
exports.DescribeDomainReqHitRateDataResponseBodyReqHitRateInterval = DescribeDomainReqHitRateDataResponseBodyReqHitRateInterval;
class DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainNames: 'domainNames',
        };
    }
    static types() {
        return {
            domainNames: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomains = DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomains;
class DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfosDomainInfo extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            updateTime: 'UpdateTime',
            createTime: 'CreateTime',
            domainCname: 'DomainCname',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            status: 'string',
            updateTime: 'string',
            createTime: 'string',
            domainCname: 'string',
            domainName: 'string',
        };
    }
}
exports.DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfosDomainInfo = DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfosDomainInfo;
class DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainInfo: 'domainInfo',
        };
    }
    static types() {
        return {
            domainInfo: { 'type': 'array', 'itemType': DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfosDomainInfo },
        };
    }
}
exports.DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfos = DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfos;
class DescribeDomainsBySourceResponseBodyDomainsListDomainsData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domains: 'Domains',
            source: 'Source',
            domainInfos: 'DomainInfos',
        };
    }
    static types() {
        return {
            domains: DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomains,
            source: 'string',
            domainInfos: DescribeDomainsBySourceResponseBodyDomainsListDomainsDataDomainInfos,
        };
    }
}
exports.DescribeDomainsBySourceResponseBodyDomainsListDomainsData = DescribeDomainsBySourceResponseBodyDomainsListDomainsData;
class DescribeDomainsBySourceResponseBodyDomainsList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domainsData: 'DomainsData',
        };
    }
    static types() {
        return {
            domainsData: { 'type': 'array', 'itemType': DescribeDomainsBySourceResponseBodyDomainsListDomainsData },
        };
    }
}
exports.DescribeDomainsBySourceResponseBodyDomainsList = DescribeDomainsBySourceResponseBodyDomainsList;
class DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            httpsValue: 'HttpsValue',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            httpsValue: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerIntervalDataModule = DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerIntervalDataModule;
class DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerInterval = DescribeDomainSrcBpsDataResponseBodySrcBpsDataPerInterval;
class DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            code: 'Code',
            proportion: 'Proportion',
            count: 'Count',
        };
    }
    static types() {
        return {
            code: 'string',
            proportion: 'string',
            count: 'string',
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData = DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData;
class DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValue extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            codeProportionData: 'CodeProportionData',
        };
    }
    static types() {
        return {
            codeProportionData: { 'type': 'array', 'itemType': DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValueCodeProportionData },
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValue = DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValue;
class DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageDataValue,
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageData = DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageData;
class DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeDataUsageData },
        };
    }
}
exports.DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeData = DescribeDomainSrcHttpCodeDataResponseBodyHttpCodeData;
class DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerIntervalDataModule = DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerIntervalDataModule;
class DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerInterval = DescribeDomainSrcQpsDataResponseBodySrcQpsDataPerInterval;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl500ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl500ListUrlList = DescribeDomainSrcTopUrlVisitResponseBodyUrl500ListUrlList;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl500List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainSrcTopUrlVisitResponseBodyUrl500ListUrlList },
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl500List = DescribeDomainSrcTopUrlVisitResponseBodyUrl500List;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl200ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl200ListUrlList = DescribeDomainSrcTopUrlVisitResponseBodyUrl200ListUrlList;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl200List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainSrcTopUrlVisitResponseBodyUrl200ListUrlList },
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl200List = DescribeDomainSrcTopUrlVisitResponseBodyUrl200List;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl400ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl400ListUrlList = DescribeDomainSrcTopUrlVisitResponseBodyUrl400ListUrlList;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl400List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainSrcTopUrlVisitResponseBodyUrl400ListUrlList },
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl400List = DescribeDomainSrcTopUrlVisitResponseBodyUrl400List;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl300ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl300ListUrlList = DescribeDomainSrcTopUrlVisitResponseBodyUrl300ListUrlList;
class DescribeDomainSrcTopUrlVisitResponseBodyUrl300List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainSrcTopUrlVisitResponseBodyUrl300ListUrlList },
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyUrl300List = DescribeDomainSrcTopUrlVisitResponseBodyUrl300List;
class DescribeDomainSrcTopUrlVisitResponseBodyAllUrlListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyAllUrlListUrlList = DescribeDomainSrcTopUrlVisitResponseBodyAllUrlListUrlList;
class DescribeDomainSrcTopUrlVisitResponseBodyAllUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainSrcTopUrlVisitResponseBodyAllUrlListUrlList },
        };
    }
}
exports.DescribeDomainSrcTopUrlVisitResponseBodyAllUrlList = DescribeDomainSrcTopUrlVisitResponseBodyAllUrlList;
class DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            httpsValue: 'HttpsValue',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            httpsValue: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerIntervalDataModule = DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerIntervalDataModule;
class DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerInterval = DescribeDomainSrcTrafficDataResponseBodySrcTrafficDataPerInterval;
class DescribeDomainsUsageByDayResponseBodyUsageTotal extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            maxSrcBpsTime: 'MaxSrcBpsTime',
            requestHitRate: 'RequestHitRate',
            maxBps: 'MaxBps',
            totalAccess: 'TotalAccess',
            bytesHitRate: 'BytesHitRate',
            totalTraffic: 'TotalTraffic',
            maxBpsTime: 'MaxBpsTime',
            maxSrcBps: 'MaxSrcBps',
        };
    }
    static types() {
        return {
            maxSrcBpsTime: 'string',
            requestHitRate: 'string',
            maxBps: 'string',
            totalAccess: 'string',
            bytesHitRate: 'string',
            totalTraffic: 'string',
            maxBpsTime: 'string',
            maxSrcBps: 'string',
        };
    }
}
exports.DescribeDomainsUsageByDayResponseBodyUsageTotal = DescribeDomainsUsageByDayResponseBodyUsageTotal;
class DescribeDomainsUsageByDayResponseBodyUsageByDaysUsageByDay extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            maxSrcBpsTime: 'MaxSrcBpsTime',
            qps: 'Qps',
            requestHitRate: 'RequestHitRate',
            maxBps: 'MaxBps',
            totalAccess: 'TotalAccess',
            timeStamp: 'TimeStamp',
            bytesHitRate: 'BytesHitRate',
            totalTraffic: 'TotalTraffic',
            maxSrcBps: 'MaxSrcBps',
            maxBpsTime: 'MaxBpsTime',
        };
    }
    static types() {
        return {
            maxSrcBpsTime: 'string',
            qps: 'string',
            requestHitRate: 'string',
            maxBps: 'string',
            totalAccess: 'string',
            timeStamp: 'string',
            bytesHitRate: 'string',
            totalTraffic: 'string',
            maxSrcBps: 'string',
            maxBpsTime: 'string',
        };
    }
}
exports.DescribeDomainsUsageByDayResponseBodyUsageByDaysUsageByDay = DescribeDomainsUsageByDayResponseBodyUsageByDaysUsageByDay;
class DescribeDomainsUsageByDayResponseBodyUsageByDays extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageByDay: 'UsageByDay',
        };
    }
    static types() {
        return {
            usageByDay: { 'type': 'array', 'itemType': DescribeDomainsUsageByDayResponseBodyUsageByDaysUsageByDay },
        };
    }
}
exports.DescribeDomainsUsageByDayResponseBodyUsageByDays = DescribeDomainsUsageByDayResponseBodyUsageByDays;
class DescribeDomainTopClientIpVisitResponseBodyClientIpList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            acc: 'Acc',
            traffic: 'Traffic',
            rank: 'Rank',
            clientIp: 'ClientIp',
        };
    }
    static types() {
        return {
            acc: 'number',
            traffic: 'number',
            rank: 'number',
            clientIp: 'string',
        };
    }
}
exports.DescribeDomainTopClientIpVisitResponseBodyClientIpList = DescribeDomainTopClientIpVisitResponseBodyClientIpList;
class DescribeDomainTopReferVisitResponseBodyTopReferListReferList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            visitData: 'VisitData',
            referDetail: 'ReferDetail',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            visitData: 'string',
            referDetail: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopReferVisitResponseBodyTopReferListReferList = DescribeDomainTopReferVisitResponseBodyTopReferListReferList;
class DescribeDomainTopReferVisitResponseBodyTopReferList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            referList: 'ReferList',
        };
    }
    static types() {
        return {
            referList: { 'type': 'array', 'itemType': DescribeDomainTopReferVisitResponseBodyTopReferListReferList },
        };
    }
}
exports.DescribeDomainTopReferVisitResponseBodyTopReferList = DescribeDomainTopReferVisitResponseBodyTopReferList;
class DescribeDomainTopUrlVisitResponseBodyUrl500ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl500ListUrlList = DescribeDomainTopUrlVisitResponseBodyUrl500ListUrlList;
class DescribeDomainTopUrlVisitResponseBodyUrl500List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainTopUrlVisitResponseBodyUrl500ListUrlList },
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl500List = DescribeDomainTopUrlVisitResponseBodyUrl500List;
class DescribeDomainTopUrlVisitResponseBodyUrl200ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl200ListUrlList = DescribeDomainTopUrlVisitResponseBodyUrl200ListUrlList;
class DescribeDomainTopUrlVisitResponseBodyUrl200List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainTopUrlVisitResponseBodyUrl200ListUrlList },
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl200List = DescribeDomainTopUrlVisitResponseBodyUrl200List;
class DescribeDomainTopUrlVisitResponseBodyUrl400ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl400ListUrlList = DescribeDomainTopUrlVisitResponseBodyUrl400ListUrlList;
class DescribeDomainTopUrlVisitResponseBodyUrl400List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainTopUrlVisitResponseBodyUrl400ListUrlList },
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl400List = DescribeDomainTopUrlVisitResponseBodyUrl400List;
class DescribeDomainTopUrlVisitResponseBodyUrl300ListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl300ListUrlList = DescribeDomainTopUrlVisitResponseBodyUrl300ListUrlList;
class DescribeDomainTopUrlVisitResponseBodyUrl300List extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainTopUrlVisitResponseBodyUrl300ListUrlList },
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyUrl300List = DescribeDomainTopUrlVisitResponseBodyUrl300List;
class DescribeDomainTopUrlVisitResponseBodyAllUrlListUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlDetail: 'UrlDetail',
            visitData: 'VisitData',
            visitProportion: 'VisitProportion',
            flow: 'Flow',
            flowProportion: 'FlowProportion',
        };
    }
    static types() {
        return {
            urlDetail: 'string',
            visitData: 'string',
            visitProportion: 'number',
            flow: 'string',
            flowProportion: 'number',
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyAllUrlListUrlList = DescribeDomainTopUrlVisitResponseBodyAllUrlListUrlList;
class DescribeDomainTopUrlVisitResponseBodyAllUrlList extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            urlList: 'UrlList',
        };
    }
    static types() {
        return {
            urlList: { 'type': 'array', 'itemType': DescribeDomainTopUrlVisitResponseBodyAllUrlListUrlList },
        };
    }
}
exports.DescribeDomainTopUrlVisitResponseBodyAllUrlList = DescribeDomainTopUrlVisitResponseBodyAllUrlList;
class DescribeDomainTrafficDataResponseBodyTrafficDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            httpsDomesticValue: 'HttpsDomesticValue',
            value: 'Value',
            overseasValue: 'OverseasValue',
            httpsValue: 'HttpsValue',
            httpsOverseasValue: 'HttpsOverseasValue',
            timeStamp: 'TimeStamp',
            domesticValue: 'DomesticValue',
        };
    }
    static types() {
        return {
            httpsDomesticValue: 'string',
            value: 'string',
            overseasValue: 'string',
            httpsValue: 'string',
            httpsOverseasValue: 'string',
            timeStamp: 'string',
            domesticValue: 'string',
        };
    }
}
exports.DescribeDomainTrafficDataResponseBodyTrafficDataPerIntervalDataModule = DescribeDomainTrafficDataResponseBodyTrafficDataPerIntervalDataModule;
class DescribeDomainTrafficDataResponseBodyTrafficDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainTrafficDataResponseBodyTrafficDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainTrafficDataResponseBodyTrafficDataPerInterval = DescribeDomainTrafficDataResponseBodyTrafficDataPerInterval;
class DescribeDomainUsageDataResponseBodyUsageDataPerIntervalDataModule extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            peakTime: 'PeakTime',
            timeStamp: 'TimeStamp',
            specialValue: 'SpecialValue',
        };
    }
    static types() {
        return {
            value: 'string',
            peakTime: 'string',
            timeStamp: 'string',
            specialValue: 'string',
        };
    }
}
exports.DescribeDomainUsageDataResponseBodyUsageDataPerIntervalDataModule = DescribeDomainUsageDataResponseBodyUsageDataPerIntervalDataModule;
class DescribeDomainUsageDataResponseBodyUsageDataPerInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataModule: 'DataModule',
        };
    }
    static types() {
        return {
            dataModule: { 'type': 'array', 'itemType': DescribeDomainUsageDataResponseBodyUsageDataPerIntervalDataModule },
        };
    }
}
exports.DescribeDomainUsageDataResponseBodyUsageDataPerInterval = DescribeDomainUsageDataResponseBodyUsageDataPerInterval;
class DescribeDomainUvDataResponseBodyUvDataIntervalUsageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            value: 'Value',
            timeStamp: 'TimeStamp',
        };
    }
    static types() {
        return {
            value: 'string',
            timeStamp: 'string',
        };
    }
}
exports.DescribeDomainUvDataResponseBodyUvDataIntervalUsageData = DescribeDomainUvDataResponseBodyUvDataIntervalUsageData;
class DescribeDomainUvDataResponseBodyUvDataInterval extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            usageData: 'UsageData',
        };
    }
    static types() {
        return {
            usageData: { 'type': 'array', 'itemType': DescribeDomainUvDataResponseBodyUvDataIntervalUsageData },
        };
    }
}
exports.DescribeDomainUvDataResponseBodyUvDataInterval = DescribeDomainUvDataResponseBodyUvDataInterval;
class DescribeFCTriggerResponseBodyFCTrigger extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            triggerARN: 'TriggerARN',
            roleARN: 'RoleARN',
            sourceArn: 'SourceArn',
            notes: 'Notes',
            eventMetaName: 'EventMetaName',
            eventMetaVersion: 'EventMetaVersion',
        };
    }
    static types() {
        return {
            triggerARN: 'string',
            roleARN: 'string',
            sourceArn: 'string',
            notes: 'string',
            eventMetaName: 'string',
            eventMetaVersion: 'string',
        };
    }
}
exports.DescribeFCTriggerResponseBodyFCTrigger = DescribeFCTriggerResponseBodyFCTrigger;
class DescribeL2VipsByDomainResponseBodyVips extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            vip: 'Vip',
        };
    }
    static types() {
        return {
            vip: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.DescribeL2VipsByDomainResponseBodyVips = DescribeL2VipsByDomainResponseBodyVips;
class DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccDataAccData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            failedNum: 'FailedNum',
            timeStamp: 'TimeStamp',
            successNum: 'SuccessNum',
        };
    }
    static types() {
        return {
            failedNum: 'number',
            timeStamp: 'string',
            successNum: 'number',
        };
    }
}
exports.DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccDataAccData = DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccDataAccData;
class DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accData: 'AccData',
        };
    }
    static types() {
        return {
            accData: { 'type': 'array', 'itemType': DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccDataAccData },
        };
    }
}
exports.DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccData = DescribeRealtimeDeliveryAccResponseBodyReatTimeDeliveryAccData;
class DescribeRefreshTaskByIdResponseBodyTasks extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            creationTime: 'CreationTime',
            objectType: 'ObjectType',
            process: 'Process',
            description: 'Description',
            objectPath: 'ObjectPath',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            status: 'string',
            creationTime: 'string',
            objectType: 'string',
            process: 'string',
            description: 'string',
            objectPath: 'string',
            taskId: 'string',
        };
    }
}
exports.DescribeRefreshTaskByIdResponseBodyTasks = DescribeRefreshTaskByIdResponseBodyTasks;
class DescribeRefreshTasksResponseBodyTasksCDNTask extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            creationTime: 'CreationTime',
            objectType: 'ObjectType',
            process: 'Process',
            description: 'Description',
            objectPath: 'ObjectPath',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            status: 'string',
            creationTime: 'string',
            objectType: 'string',
            process: 'string',
            description: 'string',
            objectPath: 'string',
            taskId: 'string',
        };
    }
}
exports.DescribeRefreshTasksResponseBodyTasksCDNTask = DescribeRefreshTasksResponseBodyTasksCDNTask;
class DescribeRefreshTasksResponseBodyTasks extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            CDNTask: 'CDNTask',
        };
    }
    static types() {
        return {
            CDNTask: { 'type': 'array', 'itemType': DescribeRefreshTasksResponseBodyTasksCDNTask },
        };
    }
}
exports.DescribeRefreshTasksResponseBodyTasks = DescribeRefreshTasksResponseBodyTasks;
class DescribeStagingIpResponseBodyIPV4s extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            IPV4: 'IPV4',
        };
    }
    static types() {
        return {
            IPV4: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.DescribeStagingIpResponseBodyIPV4s = DescribeStagingIpResponseBodyIPV4s;
class DescribeTagResourcesRequestTag extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            key: 'Key',
            value: 'Value',
        };
    }
    static types() {
        return {
            key: 'string',
            value: 'string',
        };
    }
}
exports.DescribeTagResourcesRequestTag = DescribeTagResourcesRequestTag;
class DescribeTagResourcesResponseBodyTagResourcesTag extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            key: 'Key',
            value: 'Value',
        };
    }
    static types() {
        return {
            key: 'string',
            value: 'string',
        };
    }
}
exports.DescribeTagResourcesResponseBodyTagResourcesTag = DescribeTagResourcesResponseBodyTagResourcesTag;
class DescribeTagResourcesResponseBodyTagResources extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            tag: 'Tag',
            resourceId: 'ResourceId',
        };
    }
    static types() {
        return {
            tag: { 'type': 'array', 'itemType': DescribeTagResourcesResponseBodyTagResourcesTag },
            resourceId: 'string',
        };
    }
}
exports.DescribeTagResourcesResponseBodyTagResources = DescribeTagResourcesResponseBodyTagResources;
class DescribeTopDomainsByFlowResponseBodyTopDomainsTopDomain extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            maxBps: 'MaxBps',
            rank: 'Rank',
            totalAccess: 'TotalAccess',
            trafficPercent: 'TrafficPercent',
            domainName: 'DomainName',
            totalTraffic: 'TotalTraffic',
            maxBpsTime: 'MaxBpsTime',
        };
    }
    static types() {
        return {
            maxBps: 'number',
            rank: 'number',
            totalAccess: 'number',
            trafficPercent: 'string',
            domainName: 'string',
            totalTraffic: 'string',
            maxBpsTime: 'string',
        };
    }
}
exports.DescribeTopDomainsByFlowResponseBodyTopDomainsTopDomain = DescribeTopDomainsByFlowResponseBodyTopDomainsTopDomain;
class DescribeTopDomainsByFlowResponseBodyTopDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            topDomain: 'TopDomain',
        };
    }
    static types() {
        return {
            topDomain: { 'type': 'array', 'itemType': DescribeTopDomainsByFlowResponseBodyTopDomainsTopDomain },
        };
    }
}
exports.DescribeTopDomainsByFlowResponseBodyTopDomains = DescribeTopDomainsByFlowResponseBodyTopDomains;
class DescribeUserConfigsResponseBodyConfigsOssLogConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            prefix: 'Prefix',
            enable: 'Enable',
            bucket: 'Bucket',
        };
    }
    static types() {
        return {
            prefix: 'string',
            enable: 'string',
            bucket: 'string',
        };
    }
}
exports.DescribeUserConfigsResponseBodyConfigsOssLogConfig = DescribeUserConfigsResponseBodyConfigsOssLogConfig;
class DescribeUserConfigsResponseBodyConfigsGreenManagerConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            quota: 'Quota',
            ratio: 'Ratio',
        };
    }
    static types() {
        return {
            quota: 'string',
            ratio: 'string',
        };
    }
}
exports.DescribeUserConfigsResponseBodyConfigsGreenManagerConfig = DescribeUserConfigsResponseBodyConfigsGreenManagerConfig;
class DescribeUserConfigsResponseBodyConfigsWafConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            enable: 'Enable',
        };
    }
    static types() {
        return {
            enable: 'string',
        };
    }
}
exports.DescribeUserConfigsResponseBodyConfigsWafConfig = DescribeUserConfigsResponseBodyConfigsWafConfig;
class DescribeUserConfigsResponseBodyConfigs extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            ossLogConfig: 'OssLogConfig',
            greenManagerConfig: 'GreenManagerConfig',
            wafConfig: 'WafConfig',
        };
    }
    static types() {
        return {
            ossLogConfig: DescribeUserConfigsResponseBodyConfigsOssLogConfig,
            greenManagerConfig: DescribeUserConfigsResponseBodyConfigsGreenManagerConfig,
            wafConfig: DescribeUserConfigsResponseBodyConfigsWafConfig,
        };
    }
}
exports.DescribeUserConfigsResponseBodyConfigs = DescribeUserConfigsResponseBodyConfigs;
class DescribeUserDomainsRequestTag extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            key: 'Key',
            value: 'Value',
        };
    }
    static types() {
        return {
            key: 'string',
            value: 'string',
        };
    }
}
exports.DescribeUserDomainsRequestTag = DescribeUserDomainsRequestTag;
class DescribeUserDomainsResponseBodyDomainsPageDataSourcesSource extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            type: 'Type',
            weight: 'Weight',
            priority: 'Priority',
            port: 'Port',
            content: 'Content',
        };
    }
    static types() {
        return {
            type: 'string',
            weight: 'string',
            priority: 'string',
            port: 'number',
            content: 'string',
        };
    }
}
exports.DescribeUserDomainsResponseBodyDomainsPageDataSourcesSource = DescribeUserDomainsResponseBodyDomainsPageDataSourcesSource;
class DescribeUserDomainsResponseBodyDomainsPageDataSources extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            source: 'Source',
        };
    }
    static types() {
        return {
            source: { 'type': 'array', 'itemType': DescribeUserDomainsResponseBodyDomainsPageDataSourcesSource },
        };
    }
}
exports.DescribeUserDomainsResponseBodyDomainsPageDataSources = DescribeUserDomainsResponseBodyDomainsPageDataSources;
class DescribeUserDomainsResponseBodyDomainsPageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            sslProtocol: 'SslProtocol',
            sandbox: 'Sandbox',
            sources: 'Sources',
            gmtModified: 'GmtModified',
            domainName: 'DomainName',
            gmtCreated: 'GmtCreated',
            description: 'Description',
            coverage: 'Coverage',
            resourceGroupId: 'ResourceGroupId',
            domainStatus: 'DomainStatus',
            cname: 'Cname',
            cdnType: 'CdnType',
        };
    }
    static types() {
        return {
            sslProtocol: 'string',
            sandbox: 'string',
            sources: DescribeUserDomainsResponseBodyDomainsPageDataSources,
            gmtModified: 'string',
            domainName: 'string',
            gmtCreated: 'string',
            description: 'string',
            coverage: 'string',
            resourceGroupId: 'string',
            domainStatus: 'string',
            cname: 'string',
            cdnType: 'string',
        };
    }
}
exports.DescribeUserDomainsResponseBodyDomainsPageData = DescribeUserDomainsResponseBodyDomainsPageData;
class DescribeUserDomainsResponseBodyDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            pageData: 'PageData',
        };
    }
    static types() {
        return {
            pageData: { 'type': 'array', 'itemType': DescribeUserDomainsResponseBodyDomainsPageData },
        };
    }
}
exports.DescribeUserDomainsResponseBodyDomains = DescribeUserDomainsResponseBodyDomains;
class DescribeUserTagsResponseBodyTags extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            key: 'Key',
            value: 'Value',
        };
    }
    static types() {
        return {
            key: 'string',
            value: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.DescribeUserTagsResponseBodyTags = DescribeUserTagsResponseBodyTags;
class DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            startTime: 'StartTime',
        };
    }
    static types() {
        return {
            endTime: 'string',
            startTime: 'string',
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig = DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig;
class DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            updateTime: 'UpdateTime',
            downloadUrl: 'DownloadUrl',
            createTime: 'CreateTime',
            taskName: 'TaskName',
            taskConfig: 'TaskConfig',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            status: 'string',
            updateTime: 'string',
            downloadUrl: 'string',
            createTime: 'string',
            taskName: 'string',
            taskConfig: DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig,
            taskId: 'string',
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItem = DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItem;
class DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataItem: 'DataItem',
        };
    }
    static types() {
        return {
            dataItem: { 'type': 'array', 'itemType': DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageDataDataItem },
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageData = DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageData;
class DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPage extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            data: 'Data',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
            totalCount: 'TotalCount',
        };
    }
    static types() {
        return {
            data: DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPageData,
            pageSize: 'number',
            pageNumber: 'number',
            totalCount: 'number',
        };
    }
}
exports.DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPage = DescribeUserUsageDataExportTaskResponseBodyUsageDataPerPage;
class DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            endTime: 'EndTime',
            startTime: 'StartTime',
        };
    }
    static types() {
        return {
            endTime: 'string',
            startTime: 'string',
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig = DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig;
class DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItem extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            updateTime: 'UpdateTime',
            downloadUrl: 'DownloadUrl',
            createTime: 'CreateTime',
            taskName: 'TaskName',
            taskConfig: 'TaskConfig',
            taskId: 'TaskId',
        };
    }
    static types() {
        return {
            status: 'string',
            updateTime: 'string',
            downloadUrl: 'string',
            createTime: 'string',
            taskName: 'string',
            taskConfig: DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItemTaskConfig,
            taskId: 'string',
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItem = DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItem;
class DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageData extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            dataItem: 'DataItem',
        };
    }
    static types() {
        return {
            dataItem: { 'type': 'array', 'itemType': DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageDataDataItem },
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageData = DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageData;
class DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPage extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            data: 'Data',
            pageSize: 'PageSize',
            pageNumber: 'PageNumber',
            totalCount: 'TotalCount',
        };
    }
    static types() {
        return {
            data: DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPageData,
            pageSize: 'number',
            pageNumber: 'number',
            totalCount: 'number',
        };
    }
}
exports.DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPage = DescribeUserUsageDetailDataExportTaskResponseBodyUsageDataPerPage;
class DescribeUserVipsByDomainResponseBodyVips extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            vip: 'Vip',
        };
    }
    static types() {
        return {
            vip: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.DescribeUserVipsByDomainResponseBodyVips = DescribeUserVipsByDomainResponseBodyVips;
class ListDomainsByLogConfigIdResponseBodyDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domain: 'Domain',
        };
    }
    static types() {
        return {
            domain: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.ListDomainsByLogConfigIdResponseBodyDomains = ListDomainsByLogConfigIdResponseBodyDomains;
class ListFCTriggerResponseBodyFCTriggers extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            triggerARN: 'TriggerARN',
            roleARN: 'RoleARN',
            sourceArn: 'SourceArn',
            notes: 'Notes',
            eventMetaName: 'EventMetaName',
            eventMetaVersion: 'EventMetaVersion',
        };
    }
    static types() {
        return {
            triggerARN: 'string',
            roleARN: 'string',
            sourceArn: 'string',
            notes: 'string',
            eventMetaName: 'string',
            eventMetaVersion: 'string',
        };
    }
}
exports.ListFCTriggerResponseBodyFCTriggers = ListFCTriggerResponseBodyFCTriggers;
class ListRealtimeLogDeliveryDomainsResponseBodyContentDomains extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            status: 'Status',
            domainName: 'DomainName',
        };
    }
    static types() {
        return {
            status: 'string',
            domainName: 'string',
        };
    }
}
exports.ListRealtimeLogDeliveryDomainsResponseBodyContentDomains = ListRealtimeLogDeliveryDomainsResponseBodyContentDomains;
class ListRealtimeLogDeliveryDomainsResponseBodyContent extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            domains: 'Domains',
        };
    }
    static types() {
        return {
            domains: { 'type': 'array', 'itemType': ListRealtimeLogDeliveryDomainsResponseBodyContentDomains },
        };
    }
}
exports.ListRealtimeLogDeliveryDomainsResponseBodyContent = ListRealtimeLogDeliveryDomainsResponseBodyContent;
class ListRealtimeLogDeliveryInfosResponseBodyContentRealtimeLogDeliveryInfos extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            region: 'Region',
            logstore: 'Logstore',
            project: 'Project',
        };
    }
    static types() {
        return {
            region: 'string',
            logstore: 'string',
            project: 'string',
        };
    }
}
exports.ListRealtimeLogDeliveryInfosResponseBodyContentRealtimeLogDeliveryInfos = ListRealtimeLogDeliveryInfosResponseBodyContentRealtimeLogDeliveryInfos;
class ListRealtimeLogDeliveryInfosResponseBodyContent extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            realtimeLogDeliveryInfos: 'RealtimeLogDeliveryInfos',
        };
    }
    static types() {
        return {
            realtimeLogDeliveryInfos: { 'type': 'array', 'itemType': ListRealtimeLogDeliveryInfosResponseBodyContentRealtimeLogDeliveryInfos },
        };
    }
}
exports.ListRealtimeLogDeliveryInfosResponseBodyContent = ListRealtimeLogDeliveryInfosResponseBodyContent;
class ListUserCustomLogConfigResponseBodyConfigIds extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            configId: 'ConfigId',
        };
    }
    static types() {
        return {
            configId: { 'type': 'array', 'itemType': 'string' },
        };
    }
}
exports.ListUserCustomLogConfigResponseBodyConfigIds = ListUserCustomLogConfigResponseBodyConfigIds;
class TagResourcesRequestTag extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            key: 'Key',
            value: 'Value',
        };
    }
    static types() {
        return {
            key: 'string',
            value: 'string',
        };
    }
}
exports.TagResourcesRequestTag = TagResourcesRequestTag;
class Client extends openapi_client_1.default {
    constructor(config) {
        super(config);
        this._endpointRule = "central";
        this._endpointMap = {
            'ap-northeast-1': "cdn.ap-southeast-1.aliyuncs.com",
            'ap-south-1': "cdn.ap-southeast-1.aliyuncs.com",
            'ap-southeast-1': "cdn.ap-southeast-1.aliyuncs.com",
            'ap-southeast-2': "cdn.ap-southeast-1.aliyuncs.com",
            'ap-southeast-3': "cdn.ap-southeast-1.aliyuncs.com",
            'ap-southeast-5': "cdn.ap-southeast-1.aliyuncs.com",
            'eu-central-1': "cdn.ap-southeast-1.aliyuncs.com",
            'eu-west-1': "cdn.ap-southeast-1.aliyuncs.com",
            'me-east-1': "cdn.ap-southeast-1.aliyuncs.com",
            'us-east-1': "cdn.ap-southeast-1.aliyuncs.com",
            'us-west-1': "cdn.ap-southeast-1.aliyuncs.com",
        };
        this.checkConfig(config);
        this._endpoint = this.getEndpoint("cdn", this._regionId, this._endpointRule, this._network, this._suffix, this._endpointMap, this._endpoint);
    }
    getEndpoint(productId, regionId, endpointRule, network, suffix, endpointMap, endpoint) {
        if (!tea_util_1.default.empty(endpoint)) {
            return endpoint;
        }
        if (!tea_util_1.default.isUnset(endpointMap) && !tea_util_1.default.empty(endpointMap[regionId])) {
            return endpointMap[regionId];
        }
        return endpoint_util_1.default.getEndpointRules(productId, regionId, endpointRule, network, suffix);
    }
    async addCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("AddCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new AddCdnDomainResponse({}));
    }
    async addCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.addCdnDomainWithOptions(request, runtime);
    }
    async addFCTriggerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("AddFCTrigger", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new AddFCTriggerResponse({}));
    }
    async addFCTrigger(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.addFCTriggerWithOptions(request, runtime);
    }
    async batchAddCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchAddCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchAddCdnDomainResponse({}));
    }
    async batchAddCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchAddCdnDomainWithOptions(request, runtime);
    }
    async batchSetCdnDomainConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchSetCdnDomainConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchSetCdnDomainConfigResponse({}));
    }
    async batchSetCdnDomainConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchSetCdnDomainConfigWithOptions(request, runtime);
    }
    async batchSetCdnDomainServerCertificateWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchSetCdnDomainServerCertificate", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchSetCdnDomainServerCertificateResponse({}));
    }
    async batchSetCdnDomainServerCertificate(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchSetCdnDomainServerCertificateWithOptions(request, runtime);
    }
    async batchStartCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchStartCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchStartCdnDomainResponse({}));
    }
    async batchStartCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchStartCdnDomainWithOptions(request, runtime);
    }
    async batchStopCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchStopCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchStopCdnDomainResponse({}));
    }
    async batchStopCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchStopCdnDomainWithOptions(request, runtime);
    }
    async batchUpdateCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("BatchUpdateCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new BatchUpdateCdnDomainResponse({}));
    }
    async batchUpdateCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.batchUpdateCdnDomainWithOptions(request, runtime);
    }
    async createCdnCertificateSigningRequestWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("CreateCdnCertificateSigningRequest", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new CreateCdnCertificateSigningRequestResponse({}));
    }
    async createCdnCertificateSigningRequest(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.createCdnCertificateSigningRequestWithOptions(request, runtime);
    }
    async createIllegalUrlExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("CreateIllegalUrlExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new CreateIllegalUrlExportTaskResponse({}));
    }
    async createIllegalUrlExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.createIllegalUrlExportTaskWithOptions(request, runtime);
    }
    async createRealTimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("CreateRealTimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new CreateRealTimeLogDeliveryResponse({}));
    }
    async createRealTimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.createRealTimeLogDeliveryWithOptions(request, runtime);
    }
    async createUsageDetailDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("CreateUsageDetailDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new CreateUsageDetailDataExportTaskResponse({}));
    }
    async createUsageDetailDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.createUsageDetailDataExportTaskWithOptions(request, runtime);
    }
    async createUserUsageDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("CreateUserUsageDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new CreateUserUsageDataExportTaskResponse({}));
    }
    async createUserUsageDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.createUserUsageDataExportTaskWithOptions(request, runtime);
    }
    async deleteCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteCdnDomainResponse({}));
    }
    async deleteCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteCdnDomainWithOptions(request, runtime);
    }
    async deleteFCTriggerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteFCTrigger", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteFCTriggerResponse({}));
    }
    async deleteFCTrigger(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteFCTriggerWithOptions(request, runtime);
    }
    async deleteRealtimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DeleteRealtimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DeleteRealtimeLogDeliveryResponse({}));
    }
    async deleteRealtimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteRealtimeLogDeliveryWithOptions(request, runtime);
    }
    async deleteSpecificConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteSpecificConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteSpecificConfigResponse({}));
    }
    async deleteSpecificConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteSpecificConfigWithOptions(request, runtime);
    }
    async deleteSpecificStagingConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteSpecificStagingConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteSpecificStagingConfigResponse({}));
    }
    async deleteSpecificStagingConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteSpecificStagingConfigWithOptions(request, runtime);
    }
    async deleteUsageDetailDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteUsageDetailDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteUsageDetailDataExportTaskResponse({}));
    }
    async deleteUsageDetailDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteUsageDetailDataExportTaskWithOptions(request, runtime);
    }
    async deleteUserUsageDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DeleteUserUsageDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DeleteUserUsageDataExportTaskResponse({}));
    }
    async deleteUserUsageDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.deleteUserUsageDataExportTaskWithOptions(request, runtime);
    }
    async describeActiveVersionOfConfigGroupWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeActiveVersionOfConfigGroup", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeActiveVersionOfConfigGroupResponse({}));
    }
    async describeActiveVersionOfConfigGroup(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeActiveVersionOfConfigGroupWithOptions(request, runtime);
    }
    async describeCdnCertificateDetailWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnCertificateDetail", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnCertificateDetailResponse({}));
    }
    async describeCdnCertificateDetail(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnCertificateDetailWithOptions(request, runtime);
    }
    async describeCdnCertificateListWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnCertificateList", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnCertificateListResponse({}));
    }
    async describeCdnCertificateList(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnCertificateListWithOptions(request, runtime);
    }
    async describeCdnDomainByCertificateWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnDomainByCertificate", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnDomainByCertificateResponse({}));
    }
    async describeCdnDomainByCertificate(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnDomainByCertificateWithOptions(request, runtime);
    }
    async describeCdnDomainConfigsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnDomainConfigs", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnDomainConfigsResponse({}));
    }
    async describeCdnDomainConfigs(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnDomainConfigsWithOptions(request, runtime);
    }
    async describeCdnDomainDetailWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnDomainDetail", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnDomainDetailResponse({}));
    }
    async describeCdnDomainDetail(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnDomainDetailWithOptions(request, runtime);
    }
    async describeCdnDomainLogsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnDomainLogs", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnDomainLogsResponse({}));
    }
    async describeCdnDomainLogs(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnDomainLogsWithOptions(request, runtime);
    }
    async describeCdnDomainStagingConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnDomainStagingConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnDomainStagingConfigResponse({}));
    }
    async describeCdnDomainStagingConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnDomainStagingConfigWithOptions(request, runtime);
    }
    async describeCdnHttpsDomainListWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnHttpsDomainList", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnHttpsDomainListResponse({}));
    }
    async describeCdnHttpsDomainList(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnHttpsDomainListWithOptions(request, runtime);
    }
    async describeCdnRegionAndIspWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnRegionAndIsp", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnRegionAndIspResponse({}));
    }
    async describeCdnRegionAndIsp(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnRegionAndIspWithOptions(request, runtime);
    }
    async describeCdnServiceWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnService", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnServiceResponse({}));
    }
    async describeCdnService(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnServiceWithOptions(request, runtime);
    }
    async describeCdnUserBillHistoryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserBillHistory", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserBillHistoryResponse({}));
    }
    async describeCdnUserBillHistory(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserBillHistoryWithOptions(request, runtime);
    }
    async describeCdnUserBillPredictionWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserBillPrediction", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserBillPredictionResponse({}));
    }
    async describeCdnUserBillPrediction(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserBillPredictionWithOptions(request, runtime);
    }
    async describeCdnUserBillTypeWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserBillType", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserBillTypeResponse({}));
    }
    async describeCdnUserBillType(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserBillTypeWithOptions(request, runtime);
    }
    async describeCdnUserConfigsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserConfigs", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserConfigsResponse({}));
    }
    async describeCdnUserConfigs(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserConfigsWithOptions(request, runtime);
    }
    async describeCdnUserDomainsByFuncWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserDomainsByFunc", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserDomainsByFuncResponse({}));
    }
    async describeCdnUserDomainsByFunc(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserDomainsByFuncWithOptions(request, runtime);
    }
    async describeCdnUserQuotaWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserQuota", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserQuotaResponse({}));
    }
    async describeCdnUserQuota(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserQuotaWithOptions(request, runtime);
    }
    async describeCdnUserResourcePackageWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnUserResourcePackage", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnUserResourcePackageResponse({}));
    }
    async describeCdnUserResourcePackage(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnUserResourcePackageWithOptions(request, runtime);
    }
    async describeCdnWafDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeCdnWafDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeCdnWafDomainResponse({}));
    }
    async describeCdnWafDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCdnWafDomainWithOptions(request, runtime);
    }
    async describeCertificateInfoByIDWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeCertificateInfoByID", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeCertificateInfoByIDResponse({}));
    }
    async describeCertificateInfoByID(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCertificateInfoByIDWithOptions(request, runtime);
    }
    async describeConfigOfVersionWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeConfigOfVersion", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeConfigOfVersionResponse({}));
    }
    async describeConfigOfVersion(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeConfigOfVersionWithOptions(request, runtime);
    }
    async describeCustomLogConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeCustomLogConfig", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeCustomLogConfigResponse({}));
    }
    async describeCustomLogConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeCustomLogConfigWithOptions(request, runtime);
    }
    async describeDomainAverageResponseTimeWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainAverageResponseTime", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainAverageResponseTimeResponse({}));
    }
    async describeDomainAverageResponseTime(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainAverageResponseTimeWithOptions(request, runtime);
    }
    async describeDomainBpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainBpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainBpsDataResponse({}));
    }
    async describeDomainBpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainBpsDataWithOptions(request, runtime);
    }
    async describeDomainBpsDataByLayerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainBpsDataByLayer", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainBpsDataByLayerResponse({}));
    }
    async describeDomainBpsDataByLayer(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainBpsDataByLayerWithOptions(request, runtime);
    }
    async describeDomainBpsDataByTimeStampWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainBpsDataByTimeStamp", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainBpsDataByTimeStampResponse({}));
    }
    async describeDomainBpsDataByTimeStamp(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainBpsDataByTimeStampWithOptions(request, runtime);
    }
    async describeDomainCcActivityLogWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainCcActivityLog", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainCcActivityLogResponse({}));
    }
    async describeDomainCcActivityLog(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainCcActivityLogWithOptions(request, runtime);
    }
    async describeDomainCertificateInfoWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainCertificateInfo", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainCertificateInfoResponse({}));
    }
    async describeDomainCertificateInfo(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainCertificateInfoWithOptions(request, runtime);
    }
    async describeDomainCustomLogConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainCustomLogConfig", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainCustomLogConfigResponse({}));
    }
    async describeDomainCustomLogConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainCustomLogConfigWithOptions(request, runtime);
    }
    async describeDomainDetailDataByLayerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainDetailDataByLayer", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainDetailDataByLayerResponse({}));
    }
    async describeDomainDetailDataByLayer(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainDetailDataByLayerWithOptions(request, runtime);
    }
    async describeDomainFileSizeProportionDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainFileSizeProportionData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainFileSizeProportionDataResponse({}));
    }
    async describeDomainFileSizeProportionData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainFileSizeProportionDataWithOptions(request, runtime);
    }
    async describeDomainHitRateDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainHitRateData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainHitRateDataResponse({}));
    }
    async describeDomainHitRateData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainHitRateDataWithOptions(request, runtime);
    }
    async describeDomainHttpCodeDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainHttpCodeData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainHttpCodeDataResponse({}));
    }
    async describeDomainHttpCodeData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainHttpCodeDataWithOptions(request, runtime);
    }
    async describeDomainHttpCodeDataByLayerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainHttpCodeDataByLayer", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainHttpCodeDataByLayerResponse({}));
    }
    async describeDomainHttpCodeDataByLayer(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainHttpCodeDataByLayerWithOptions(request, runtime);
    }
    async describeDomainISPDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainISPData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainISPDataResponse({}));
    }
    async describeDomainISPData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainISPDataWithOptions(request, runtime);
    }
    async describeDomainMax95BpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainMax95BpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainMax95BpsDataResponse({}));
    }
    async describeDomainMax95BpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainMax95BpsDataWithOptions(request, runtime);
    }
    async describeDomainNamesOfVersionWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainNamesOfVersion", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainNamesOfVersionResponse({}));
    }
    async describeDomainNamesOfVersion(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainNamesOfVersionWithOptions(request, runtime);
    }
    async describeDomainPathDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainPathData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainPathDataResponse({}));
    }
    async describeDomainPathData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainPathDataWithOptions(request, runtime);
    }
    async describeDomainPvDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainPvData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainPvDataResponse({}));
    }
    async describeDomainPvData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainPvDataWithOptions(request, runtime);
    }
    async describeDomainQpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainQpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainQpsDataResponse({}));
    }
    async describeDomainQpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainQpsDataWithOptions(request, runtime);
    }
    async describeDomainQpsDataByLayerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainQpsDataByLayer", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainQpsDataByLayerResponse({}));
    }
    async describeDomainQpsDataByLayer(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainQpsDataByLayerWithOptions(request, runtime);
    }
    async describeDomainRealTimeBpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeBpsData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealTimeBpsDataResponse({}));
    }
    async describeDomainRealTimeBpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeBpsDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeByteHitRateDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeByteHitRateData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealTimeByteHitRateDataResponse({}));
    }
    async describeDomainRealTimeByteHitRateData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeByteHitRateDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeDetailDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeDetailData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealTimeDetailDataResponse({}));
    }
    async describeDomainRealTimeDetailData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeDetailDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeHttpCodeDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeHttpCodeData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRealTimeHttpCodeDataResponse({}));
    }
    async describeDomainRealTimeHttpCodeData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeHttpCodeDataWithOptions(request, runtime);
    }
    async describeDomainRealtimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealtimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealtimeLogDeliveryResponse({}));
    }
    async describeDomainRealtimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealtimeLogDeliveryWithOptions(request, runtime);
    }
    async describeDomainRealTimeQpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeQpsData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealTimeQpsDataResponse({}));
    }
    async describeDomainRealTimeQpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeQpsDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeReqHitRateDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeReqHitRateData", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeDomainRealTimeReqHitRateDataResponse({}));
    }
    async describeDomainRealTimeReqHitRateData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeReqHitRateDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeSrcBpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeSrcBpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRealTimeSrcBpsDataResponse({}));
    }
    async describeDomainRealTimeSrcBpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeSrcBpsDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeSrcHttpCodeDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeSrcHttpCodeData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRealTimeSrcHttpCodeDataResponse({}));
    }
    async describeDomainRealTimeSrcHttpCodeData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeSrcHttpCodeDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeSrcTrafficDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeSrcTrafficData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRealTimeSrcTrafficDataResponse({}));
    }
    async describeDomainRealTimeSrcTrafficData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeSrcTrafficDataWithOptions(request, runtime);
    }
    async describeDomainRealTimeTrafficDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRealTimeTrafficData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRealTimeTrafficDataResponse({}));
    }
    async describeDomainRealTimeTrafficData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRealTimeTrafficDataWithOptions(request, runtime);
    }
    async describeDomainRegionDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainRegionData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainRegionDataResponse({}));
    }
    async describeDomainRegionData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainRegionDataWithOptions(request, runtime);
    }
    async describeDomainReqHitRateDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainReqHitRateData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainReqHitRateDataResponse({}));
    }
    async describeDomainReqHitRateData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainReqHitRateDataWithOptions(request, runtime);
    }
    async describeDomainsBySourceWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainsBySource", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainsBySourceResponse({}));
    }
    async describeDomainsBySource(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainsBySourceWithOptions(request, runtime);
    }
    async describeDomainSrcBpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainSrcBpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainSrcBpsDataResponse({}));
    }
    async describeDomainSrcBpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainSrcBpsDataWithOptions(request, runtime);
    }
    async describeDomainSrcHttpCodeDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainSrcHttpCodeData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainSrcHttpCodeDataResponse({}));
    }
    async describeDomainSrcHttpCodeData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainSrcHttpCodeDataWithOptions(request, runtime);
    }
    async describeDomainSrcQpsDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainSrcQpsData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainSrcQpsDataResponse({}));
    }
    async describeDomainSrcQpsData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainSrcQpsDataWithOptions(request, runtime);
    }
    async describeDomainSrcTopUrlVisitWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainSrcTopUrlVisit", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainSrcTopUrlVisitResponse({}));
    }
    async describeDomainSrcTopUrlVisit(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainSrcTopUrlVisitWithOptions(request, runtime);
    }
    async describeDomainSrcTrafficDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainSrcTrafficData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainSrcTrafficDataResponse({}));
    }
    async describeDomainSrcTrafficData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainSrcTrafficDataWithOptions(request, runtime);
    }
    async describeDomainsUsageByDayWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainsUsageByDay", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainsUsageByDayResponse({}));
    }
    async describeDomainsUsageByDay(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainsUsageByDayWithOptions(request, runtime);
    }
    async describeDomainTopClientIpVisitWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainTopClientIpVisit", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainTopClientIpVisitResponse({}));
    }
    async describeDomainTopClientIpVisit(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainTopClientIpVisitWithOptions(request, runtime);
    }
    async describeDomainTopReferVisitWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainTopReferVisit", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainTopReferVisitResponse({}));
    }
    async describeDomainTopReferVisit(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainTopReferVisitWithOptions(request, runtime);
    }
    async describeDomainTopUrlVisitWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainTopUrlVisit", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainTopUrlVisitResponse({}));
    }
    async describeDomainTopUrlVisit(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainTopUrlVisitWithOptions(request, runtime);
    }
    async describeDomainTrafficDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainTrafficData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainTrafficDataResponse({}));
    }
    async describeDomainTrafficData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainTrafficDataWithOptions(request, runtime);
    }
    async describeDomainUsageDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainUsageData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainUsageDataResponse({}));
    }
    async describeDomainUsageData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainUsageDataWithOptions(request, runtime);
    }
    async describeDomainUvDataWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeDomainUvData", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeDomainUvDataResponse({}));
    }
    async describeDomainUvData(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeDomainUvDataWithOptions(request, runtime);
    }
    async describeFCTriggerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeFCTrigger", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeFCTriggerResponse({}));
    }
    async describeFCTrigger(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeFCTriggerWithOptions(request, runtime);
    }
    async describeIllegalUrlExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeIllegalUrlExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeIllegalUrlExportTaskResponse({}));
    }
    async describeIllegalUrlExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeIllegalUrlExportTaskWithOptions(request, runtime);
    }
    async describeIpInfoWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeIpInfo", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeIpInfoResponse({}));
    }
    async describeIpInfo(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeIpInfoWithOptions(request, runtime);
    }
    async describeL2VipsByDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeL2VipsByDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeL2VipsByDomainResponse({}));
    }
    async describeL2VipsByDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeL2VipsByDomainWithOptions(request, runtime);
    }
    async describeRangeDataByLocateAndIspServiceWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeRangeDataByLocateAndIspService", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeRangeDataByLocateAndIspServiceResponse({}));
    }
    async describeRangeDataByLocateAndIspService(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeRangeDataByLocateAndIspServiceWithOptions(request, runtime);
    }
    async describeRealtimeDeliveryAccWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeRealtimeDeliveryAcc", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeRealtimeDeliveryAccResponse({}));
    }
    async describeRealtimeDeliveryAcc(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeRealtimeDeliveryAccWithOptions(request, runtime);
    }
    async describeRefreshQuotaWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeRefreshQuota", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeRefreshQuotaResponse({}));
    }
    async describeRefreshQuota(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeRefreshQuotaWithOptions(request, runtime);
    }
    async describeRefreshTaskByIdWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeRefreshTaskById", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeRefreshTaskByIdResponse({}));
    }
    async describeRefreshTaskById(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeRefreshTaskByIdWithOptions(request, runtime);
    }
    async describeRefreshTasksWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeRefreshTasks", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeRefreshTasksResponse({}));
    }
    async describeRefreshTasks(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeRefreshTasksWithOptions(request, runtime);
    }
    async describeStagingIpWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeStagingIp", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeStagingIpResponse({}));
    }
    async describeStagingIp(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeStagingIpWithOptions(request, runtime);
    }
    async describeTagResourcesWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeTagResources", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeTagResourcesResponse({}));
    }
    async describeTagResources(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeTagResourcesWithOptions(request, runtime);
    }
    async describeTopDomainsByFlowWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeTopDomainsByFlow", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeTopDomainsByFlowResponse({}));
    }
    async describeTopDomainsByFlow(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeTopDomainsByFlowWithOptions(request, runtime);
    }
    async describeUserCertificateExpireCountWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserCertificateExpireCount", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserCertificateExpireCountResponse({}));
    }
    async describeUserCertificateExpireCount(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserCertificateExpireCountWithOptions(request, runtime);
    }
    async describeUserConfigsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserConfigs", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserConfigsResponse({}));
    }
    async describeUserConfigs(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserConfigsWithOptions(request, runtime);
    }
    async describeUserDomainsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserDomains", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserDomainsResponse({}));
    }
    async describeUserDomains(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserDomainsWithOptions(request, runtime);
    }
    async describeUserTagsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserTags", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserTagsResponse({}));
    }
    async describeUserTags(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserTagsWithOptions(request, runtime);
    }
    async describeUserUsageDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserUsageDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserUsageDataExportTaskResponse({}));
    }
    async describeUserUsageDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserUsageDataExportTaskWithOptions(request, runtime);
    }
    async describeUserUsageDetailDataExportTaskWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserUsageDetailDataExportTask", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeUserUsageDetailDataExportTaskResponse({}));
    }
    async describeUserUsageDetailDataExportTask(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserUsageDetailDataExportTaskWithOptions(request, runtime);
    }
    async describeUserVipsByDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DescribeUserVipsByDomain", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DescribeUserVipsByDomainResponse({}));
    }
    async describeUserVipsByDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeUserVipsByDomainWithOptions(request, runtime);
    }
    async describeVerifyContentWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("DescribeVerifyContent", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new DescribeVerifyContentResponse({}));
    }
    async describeVerifyContent(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.describeVerifyContentWithOptions(request, runtime);
    }
    async disableRealtimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("DisableRealtimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new DisableRealtimeLogDeliveryResponse({}));
    }
    async disableRealtimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.disableRealtimeLogDeliveryWithOptions(request, runtime);
    }
    async enableRealtimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("EnableRealtimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new EnableRealtimeLogDeliveryResponse({}));
    }
    async enableRealtimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.enableRealtimeLogDeliveryWithOptions(request, runtime);
    }
    async listDomainsByLogConfigIdWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ListDomainsByLogConfigId", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ListDomainsByLogConfigIdResponse({}));
    }
    async listDomainsByLogConfigId(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.listDomainsByLogConfigIdWithOptions(request, runtime);
    }
    async listFCTriggerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ListFCTrigger", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ListFCTriggerResponse({}));
    }
    async listFCTrigger(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.listFCTriggerWithOptions(request, runtime);
    }
    async listRealtimeLogDeliveryDomainsWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ListRealtimeLogDeliveryDomains", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ListRealtimeLogDeliveryDomainsResponse({}));
    }
    async listRealtimeLogDeliveryDomains(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.listRealtimeLogDeliveryDomainsWithOptions(request, runtime);
    }
    async listRealtimeLogDeliveryInfosWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ListRealtimeLogDeliveryInfos", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ListRealtimeLogDeliveryInfosResponse({}));
    }
    async listRealtimeLogDeliveryInfos(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.listRealtimeLogDeliveryInfosWithOptions(request, runtime);
    }
    async listUserCustomLogConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ListUserCustomLogConfig", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ListUserCustomLogConfigResponse({}));
    }
    async listUserCustomLogConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.listUserCustomLogConfigWithOptions(request, runtime);
    }
    async modifyCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("ModifyCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new ModifyCdnDomainResponse({}));
    }
    async modifyCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyCdnDomainWithOptions(request, runtime);
    }
    async modifyCdnDomainSchdmByPropertyWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("ModifyCdnDomainSchdmByProperty", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new ModifyCdnDomainSchdmByPropertyResponse({}));
    }
    async modifyCdnDomainSchdmByProperty(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyCdnDomainSchdmByPropertyWithOptions(request, runtime);
    }
    async modifyCdnServiceWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("ModifyCdnService", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new ModifyCdnServiceResponse({}));
    }
    async modifyCdnService(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyCdnServiceWithOptions(request, runtime);
    }
    async modifyDomainCustomLogConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ModifyDomainCustomLogConfig", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ModifyDomainCustomLogConfigResponse({}));
    }
    async modifyDomainCustomLogConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyDomainCustomLogConfigWithOptions(request, runtime);
    }
    async modifyRealtimeLogDeliveryWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ModifyRealtimeLogDelivery", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ModifyRealtimeLogDeliveryResponse({}));
    }
    async modifyRealtimeLogDelivery(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyRealtimeLogDeliveryWithOptions(request, runtime);
    }
    async modifyUserCustomLogConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let query = openapi_util_1.default.query(tea_util_1.default.toMap(request));
        let req = new $OpenApi.OpenApiRequest({
            query: query,
        });
        return $tea.cast(await this.doRPCRequest("ModifyUserCustomLogConfig", "2018-05-10", "HTTPS", "GET", "AK", "json", req, runtime), new ModifyUserCustomLogConfigResponse({}));
    }
    async modifyUserCustomLogConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.modifyUserCustomLogConfigWithOptions(request, runtime);
    }
    async openCdnServiceWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("OpenCdnService", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new OpenCdnServiceResponse({}));
    }
    async openCdnService(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.openCdnServiceWithOptions(request, runtime);
    }
    async publishStagingConfigToProductionWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("PublishStagingConfigToProduction", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new PublishStagingConfigToProductionResponse({}));
    }
    async publishStagingConfigToProduction(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.publishStagingConfigToProductionWithOptions(request, runtime);
    }
    async pushObjectCacheWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("PushObjectCache", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new PushObjectCacheResponse({}));
    }
    async pushObjectCache(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.pushObjectCacheWithOptions(request, runtime);
    }
    async refreshObjectCachesWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("RefreshObjectCaches", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new RefreshObjectCachesResponse({}));
    }
    async refreshObjectCaches(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.refreshObjectCachesWithOptions(request, runtime);
    }
    async rollbackStagingConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("RollbackStagingConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new RollbackStagingConfigResponse({}));
    }
    async rollbackStagingConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.rollbackStagingConfigWithOptions(request, runtime);
    }
    async setCcConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetCcConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetCcConfigResponse({}));
    }
    async setCcConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setCcConfigWithOptions(request, runtime);
    }
    async setCdnDomainCSRCertificateWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetCdnDomainCSRCertificate", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetCdnDomainCSRCertificateResponse({}));
    }
    async setCdnDomainCSRCertificate(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setCdnDomainCSRCertificateWithOptions(request, runtime);
    }
    async setCdnDomainStagingConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetCdnDomainStagingConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetCdnDomainStagingConfigResponse({}));
    }
    async setCdnDomainStagingConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setCdnDomainStagingConfigWithOptions(request, runtime);
    }
    async setConfigOfVersionWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetConfigOfVersion", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetConfigOfVersionResponse({}));
    }
    async setConfigOfVersion(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setConfigOfVersionWithOptions(request, runtime);
    }
    async setDomainGreenManagerConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetDomainGreenManagerConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetDomainGreenManagerConfigResponse({}));
    }
    async setDomainGreenManagerConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setDomainGreenManagerConfigWithOptions(request, runtime);
    }
    async setDomainServerCertificateWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetDomainServerCertificate", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetDomainServerCertificateResponse({}));
    }
    async setDomainServerCertificate(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setDomainServerCertificateWithOptions(request, runtime);
    }
    async setErrorPageConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetErrorPageConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetErrorPageConfigResponse({}));
    }
    async setErrorPageConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setErrorPageConfigWithOptions(request, runtime);
    }
    async setFileCacheExpiredConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetFileCacheExpiredConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetFileCacheExpiredConfigResponse({}));
    }
    async setFileCacheExpiredConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setFileCacheExpiredConfigWithOptions(request, runtime);
    }
    async setForceRedirectConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetForceRedirectConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetForceRedirectConfigResponse({}));
    }
    async setForceRedirectConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setForceRedirectConfigWithOptions(request, runtime);
    }
    async setForwardSchemeConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetForwardSchemeConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetForwardSchemeConfigResponse({}));
    }
    async setForwardSchemeConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setForwardSchemeConfigWithOptions(request, runtime);
    }
    async setHttpErrorPageConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetHttpErrorPageConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetHttpErrorPageConfigResponse({}));
    }
    async setHttpErrorPageConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setHttpErrorPageConfigWithOptions(request, runtime);
    }
    async setHttpHeaderConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetHttpHeaderConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetHttpHeaderConfigResponse({}));
    }
    async setHttpHeaderConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setHttpHeaderConfigWithOptions(request, runtime);
    }
    async setHttpsOptionConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetHttpsOptionConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetHttpsOptionConfigResponse({}));
    }
    async setHttpsOptionConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setHttpsOptionConfigWithOptions(request, runtime);
    }
    async setIgnoreQueryStringConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetIgnoreQueryStringConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetIgnoreQueryStringConfigResponse({}));
    }
    async setIgnoreQueryStringConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setIgnoreQueryStringConfigWithOptions(request, runtime);
    }
    async setIpAllowListConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetIpAllowListConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetIpAllowListConfigResponse({}));
    }
    async setIpAllowListConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setIpAllowListConfigWithOptions(request, runtime);
    }
    async setIpBlackListConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetIpBlackListConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetIpBlackListConfigResponse({}));
    }
    async setIpBlackListConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setIpBlackListConfigWithOptions(request, runtime);
    }
    async setOptimizeConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetOptimizeConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetOptimizeConfigResponse({}));
    }
    async setOptimizeConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setOptimizeConfigWithOptions(request, runtime);
    }
    async setPageCompressConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetPageCompressConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetPageCompressConfigResponse({}));
    }
    async setPageCompressConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setPageCompressConfigWithOptions(request, runtime);
    }
    async setRangeConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetRangeConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetRangeConfigResponse({}));
    }
    async setRangeConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setRangeConfigWithOptions(request, runtime);
    }
    async setRefererConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetRefererConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetRefererConfigResponse({}));
    }
    async setRefererConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setRefererConfigWithOptions(request, runtime);
    }
    async setRemoveQueryStringConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetRemoveQueryStringConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetRemoveQueryStringConfigResponse({}));
    }
    async setRemoveQueryStringConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setRemoveQueryStringConfigWithOptions(request, runtime);
    }
    async setReqAuthConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetReqAuthConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetReqAuthConfigResponse({}));
    }
    async setReqAuthConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setReqAuthConfigWithOptions(request, runtime);
    }
    async setReqHeaderConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetReqHeaderConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetReqHeaderConfigResponse({}));
    }
    async setReqHeaderConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setReqHeaderConfigWithOptions(request, runtime);
    }
    async setSourceHostConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetSourceHostConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetSourceHostConfigResponse({}));
    }
    async setSourceHostConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setSourceHostConfigWithOptions(request, runtime);
    }
    async setWaitingRoomConfigWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("SetWaitingRoomConfig", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new SetWaitingRoomConfigResponse({}));
    }
    async setWaitingRoomConfig(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.setWaitingRoomConfigWithOptions(request, runtime);
    }
    async startCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("StartCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new StartCdnDomainResponse({}));
    }
    async startCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.startCdnDomainWithOptions(request, runtime);
    }
    async stopCdnDomainWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("StopCdnDomain", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new StopCdnDomainResponse({}));
    }
    async stopCdnDomain(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.stopCdnDomainWithOptions(request, runtime);
    }
    async tagResourcesWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("TagResources", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new TagResourcesResponse({}));
    }
    async tagResources(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.tagResourcesWithOptions(request, runtime);
    }
    async untagResourcesWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("UntagResources", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new UntagResourcesResponse({}));
    }
    async untagResources(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.untagResourcesWithOptions(request, runtime);
    }
    async updateFCTriggerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("UpdateFCTrigger", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new UpdateFCTriggerResponse({}));
    }
    async updateFCTrigger(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.updateFCTriggerWithOptions(request, runtime);
    }
    async verifyDomainOwnerWithOptions(request, runtime) {
        tea_util_1.default.validateModel(request);
        let req = new $OpenApi.OpenApiRequest({
            body: tea_util_1.default.toMap(request),
        });
        return $tea.cast(await this.doRPCRequest("VerifyDomainOwner", "2018-05-10", "HTTPS", "POST", "AK", "json", req, runtime), new VerifyDomainOwnerResponse({}));
    }
    async verifyDomainOwner(request) {
        let runtime = new $Util.RuntimeOptions({});
        return await this.verifyDomainOwnerWithOptions(request, runtime);
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 9892:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OpenApiRequest = exports.Config = void 0;
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi SDK
 */
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const credentials_1 = __importStar(__nccwpck_require__(595)), $Credential = credentials_1;
const openapi_util_1 = __importDefault(__nccwpck_require__(8190));
const $tea = __importStar(__nccwpck_require__(4165));
/**
 * Model for initing client
 */
class Config extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'accessKeyId',
            accessKeySecret: 'accessKeySecret',
            securityToken: 'securityToken',
            protocol: 'protocol',
            regionId: 'regionId',
            readTimeout: 'readTimeout',
            connectTimeout: 'connectTimeout',
            httpProxy: 'httpProxy',
            httpsProxy: 'httpsProxy',
            credential: 'credential',
            endpoint: 'endpoint',
            noProxy: 'noProxy',
            maxIdleConns: 'maxIdleConns',
            network: 'network',
            userAgent: 'userAgent',
            suffix: 'suffix',
            socks5Proxy: 'socks5Proxy',
            socks5NetWork: 'socks5NetWork',
            endpointType: 'endpointType',
            openPlatformEndpoint: 'openPlatformEndpoint',
            type: 'type',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            securityToken: 'string',
            protocol: 'string',
            regionId: 'string',
            readTimeout: 'number',
            connectTimeout: 'number',
            httpProxy: 'string',
            httpsProxy: 'string',
            credential: credentials_1.default,
            endpoint: 'string',
            noProxy: 'string',
            maxIdleConns: 'number',
            network: 'string',
            userAgent: 'string',
            suffix: 'string',
            socks5Proxy: 'string',
            socks5NetWork: 'string',
            endpointType: 'string',
            openPlatformEndpoint: 'string',
            type: 'string',
        };
    }
}
exports.Config = Config;
class OpenApiRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            query: 'query',
            body: 'body',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            query: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: 'any',
        };
    }
}
exports.OpenApiRequest = OpenApiRequest;
class Client {
    /**
     * Init client with Config
     * @param config config contains the necessary information to create a client
     */
    constructor(config) {
        if (tea_util_1.default.isUnset($tea.toMap(config))) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config' can not be unset",
            });
        }
        if (!tea_util_1.default.empty(config.accessKeyId) && !tea_util_1.default.empty(config.accessKeySecret)) {
            if (!tea_util_1.default.empty(config.securityToken)) {
                config.type = "sts";
            }
            else {
                config.type = "access_key";
            }
            let credentialConfig = new $Credential.Config({
                accessKeyId: config.accessKeyId,
                type: config.type,
                accessKeySecret: config.accessKeySecret,
                securityToken: config.securityToken,
            });
            this._credential = new credentials_1.default(credentialConfig);
        }
        else if (!tea_util_1.default.isUnset(config.credential)) {
            this._credential = config.credential;
        }
        this._endpoint = config.endpoint;
        this._protocol = config.protocol;
        this._regionId = config.regionId;
        this._userAgent = config.userAgent;
        this._readTimeout = config.readTimeout;
        this._connectTimeout = config.connectTimeout;
        this._httpProxy = config.httpProxy;
        this._httpsProxy = config.httpsProxy;
        this._noProxy = config.noProxy;
        this._socks5Proxy = config.socks5Proxy;
        this._socks5NetWork = config.socks5NetWork;
        this._maxIdleConns = config.maxIdleConns;
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doRPCRequest(action, version, protocol, method, authType, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = "/";
                request_.query = Object.assign({ Action: action, Format: "json", Version: version, Timestamp: openapi_util_1.default.getTimestamp(), SignatureNonce: tea_util_1.default.getNonce() }, request.query);
                // endpoint is setted in product client
                request_.headers = {
                    host: this._endpoint,
                    'x-acs-version': version,
                    'x-acs-action': action,
                    'user-agent': this.getUserAgent(),
                };
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    let tmp = tea_util_1.default.anyifyMapValue(openapi_util_1.default.query(m));
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toFormString(tmp));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.query["SecurityToken"] = securityToken;
                    }
                    request_.query["SignatureMethod"] = "HMAC-SHA1";
                    request_.query["SignatureVersion"] = "1.0";
                    request_.query["AccessKeyId"] = accessKeyId;
                    let t = null;
                    if (!tea_util_1.default.isUnset(request.body)) {
                        t = tea_util_1.default.assertAsMap(request.body);
                    }
                    let signedParam = Object.assign(Object.assign({}, request_.query), openapi_util_1.default.query(t));
                    request_.query["Signature"] = openapi_util_1.default.getRPCSignature(signedParam, request_.method, accessKeySecret);
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequest(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                request_.headers = Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toJSONString(request.body));
                    request_.headers["content-type"] = "application/json; charset=utf-8";
                }
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = request.query;
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network with form body
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequestWithForm(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                request_.headers = Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    request_.body = new $tea.BytesReadable(openapi_util_1.default.toForm(m));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = request.query;
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Get user agent
     * @return user agent
     */
    getUserAgent() {
        let userAgent = tea_util_1.default.getUserAgent(this._userAgent);
        return userAgent;
    }
    /**
     * Get accesskey id by using credential
     * @return accesskey id
     */
    async getAccessKeyId() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let accessKeyId = await this._credential.getAccessKeyId();
        return accessKeyId;
    }
    /**
     * Get accesskey secret by using credential
     * @return accesskey secret
     */
    async getAccessKeySecret() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let secret = await this._credential.getAccessKeySecret();
        return secret;
    }
    /**
     * Get security token by using credential
     * @return security token
     */
    async getSecurityToken() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let token = await this._credential.getSecurityToken();
        return token;
    }
    /**
     * If inputValue is not null, return it or return defaultValue
     * @param inputValue  users input value
     * @param defaultValue default value
     * @return the final result
     */
    static defaultAny(inputValue, defaultValue) {
        if (tea_util_1.default.isUnset(inputValue)) {
            return defaultValue;
        }
        return inputValue;
    }
    /**
     * If the endpointRule and config.endpoint are empty, throw error
     * @param config config contains the necessary information to create a client
     */
    checkConfig(config) {
        if (tea_util_1.default.empty(this._endpointRule) && tea_util_1.default.empty(config.endpoint)) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config.endpoint' can not be empty",
            });
        }
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 9690:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(6495));
const config_1 = __importDefault(__nccwpck_require__(1140));
class AccessKeyCredential extends default_credential_1.default {
    constructor(accessKeyId, accessKeySecret) {
        if (!accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for access_key');
        }
        if (!accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for access_key');
        }
        const conf = new config_1.default({
            type: 'access_key',
            accessKeyId,
            accessKeySecret
        });
        super(conf);
    }
}
exports.default = AccessKeyCredential;
//# sourceMappingURL=access_key_credential.js.map

/***/ }),

/***/ 7311:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(6495));
const config_1 = __importDefault(__nccwpck_require__(1140));
class BearerTokenCredential extends default_credential_1.default {
    constructor(bearerToken) {
        if (!bearerToken) {
            throw new Error('Missing required bearerToken option in config for bearer');
        }
        const conf = new config_1.default({
            type: 'bearer'
        });
        super(conf);
        this.bearerToken = bearerToken;
    }
    getBearerToken() {
        return this.bearerToken;
    }
}
exports.default = BearerTokenCredential;
//# sourceMappingURL=bearer_token_credential.js.map

/***/ }),

/***/ 595:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const access_key_credential_1 = __importDefault(__nccwpck_require__(9690));
const sts_token_credential_1 = __importDefault(__nccwpck_require__(8370));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4993));
const ram_role_arn_credential_1 = __importDefault(__nccwpck_require__(8470));
const rsa_key_pair_credential_1 = __importDefault(__nccwpck_require__(9904));
const bearer_token_credential_1 = __importDefault(__nccwpck_require__(7311));
const DefaultProvider = __importStar(__nccwpck_require__(3887));
const config_1 = __importDefault(__nccwpck_require__(1140));
exports.Config = config_1.default;
class Credential {
    constructor(config = null, runtime = {}) {
        this.load(config, runtime);
    }
    getAccessKeyId() {
        return this.credential.getAccessKeyId();
    }
    getAccessKeySecret() {
        return this.credential.getAccessKeySecret();
    }
    getSecurityToken() {
        return this.credential.getSecurityToken();
    }
    getType() {
        return this.credential.getType();
    }
    load(config, runtime = {}) {
        if (!config) {
            this.credential = DefaultProvider.getCredentials();
            return;
        }
        if (!config.type) {
            throw new Error('Missing required type option');
        }
        switch (config.type) {
            case 'access_key':
                this.credential = new access_key_credential_1.default(config.accessKeyId, config.accessKeySecret);
                break;
            case 'sts':
                this.credential = new sts_token_credential_1.default(config.accessKeyId, config.accessKeySecret, config.securityToken);
                break;
            case 'ecs_ram_role':
                this.credential = new ecs_ram_role_credential_1.default(config.roleName);
                break;
            case 'ram_role_arn':
                this.credential = new ram_role_arn_credential_1.default(config, runtime);
                break;
            case 'rsa_key_pair':
                this.credential = new rsa_key_pair_credential_1.default(config.publicKeyId, config.privateKeyFile);
                break;
            case 'bearer':
                this.credential = new bearer_token_credential_1.default(config.bearerToken);
                break;
            default:
                throw new Error('Invalid type option, support: access_key, sts, ecs_ram_role, ram_role_arn, rsa_key_pair');
        }
    }
}
exports.default = Credential;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 1140:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const $tea = __importStar(__nccwpck_require__(4165));
class Config extends $tea.Model {
    constructor(config) {
        super(config);
    }
    static names() {
        return {
            accessKeyId: 'accessKeyId',
            accessKeySecret: 'accessKeySecret',
            securityToken: 'securityToken',
            bearerToken: 'bearerToken',
            durationSeconds: 'durationSeconds',
            roleArn: 'roleArn',
            policy: 'policy',
            roleSessionExpiration: 'roleSessionExpiration',
            roleSessionName: 'roleSessionName',
            publicKeyId: 'publicKeyId',
            privateKeyFile: 'privateKeyFile',
            roleName: 'roleName',
            type: 'type',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            securityToken: 'string',
            bearerToken: 'string',
            durationSeconds: 'number',
            roleArn: 'string',
            policy: 'string',
            roleSessionExpiration: 'number',
            roleSessionName: 'string',
            publicKeyId: 'string',
            privateKeyFile: 'string',
            roleName: 'string',
            type: 'string',
        };
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map

/***/ }),

/***/ 6495:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class DefaultCredential {
    constructor(config) {
        this.accessKeyId = config.accessKeyId || '';
        this.accessKeySecret = config.accessKeySecret || '';
        this.securityToken = config.securityToken || '';
        this.type = config.type || '';
    }
    async getAccessKeyId() {
        return this.accessKeyId;
    }
    async getAccessKeySecret() {
        return this.accessKeySecret;
    }
    async getSecurityToken() {
        return this.securityToken;
    }
    getType() {
        return this.type;
    }
}
exports.default = DefaultCredential;
//# sourceMappingURL=default_credential.js.map

/***/ }),

/***/ 4993:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const session_credential_1 = __importDefault(__nccwpck_require__(6056));
const httpx_1 = __importDefault(__nccwpck_require__(9074));
const config_1 = __importDefault(__nccwpck_require__(1140));
const SECURITY_CRED_URL = 'http://100.100.100.200/latest/meta-data/ram/security-credentials/';
class EcsRamRoleCredential extends session_credential_1.default {
    constructor(roleName = '', runtime = {}) {
        const conf = new config_1.default({
            type: 'ecs_ram_role',
        });
        super(conf);
        this.roleName = roleName;
        this.runtime = runtime;
        this.sessionCredential = null;
    }
    async getBody(url) {
        const response = await httpx_1.default.request(url, {});
        return (await httpx_1.default.read(response, 'utf8'));
    }
    async updateCredential() {
        const roleName = await this.getRoleName();
        const url = SECURITY_CRED_URL + roleName;
        const body = await this.getBody(url);
        const json = JSON.parse(body);
        this.sessionCredential = {
            AccessKeyId: json.AccessKeyId,
            AccessKeySecret: json.AccessKeySecret,
            Expiration: json.Expiration,
            SecurityToken: json.SecurityToken,
        };
    }
    async getRoleName() {
        if (this.roleName && this.roleName.length) {
            return this.roleName;
        }
        return await this.getBody(SECURITY_CRED_URL);
    }
}
exports.default = EcsRamRoleCredential;
//# sourceMappingURL=ecs_ram_role_credential.js.map

/***/ }),

/***/ 4316:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const access_key_credential_1 = __importDefault(__nccwpck_require__(9690));
exports.default = {
    getCredential() {
        const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
        const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
        if (accessKeyId === undefined || accessKeySecret === undefined) {
            return null;
        }
        if (accessKeyId === null || accessKeyId === '') {
            throw new Error('Environment variable ALIBABA_CLOUD_ACCESS_KEY_ID cannot be empty');
        }
        if (accessKeySecret === null || accessKeySecret === '') {
            throw new Error('Environment variable ALIBABA_CLOUD_ACCESS_KEY_SECRET cannot be empty');
        }
        return new access_key_credential_1.default(accessKeyId, accessKeySecret);
    }
};
//# sourceMappingURL=environment_variable_credentials_provider.js.map

/***/ }),

/***/ 1897:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4993));
exports.default = {
    getCredential() {
        const roleName = process.env.ALIBABA_CLOUD_ECS_METADATA;
        if (roleName && roleName.length) {
            return new ecs_ram_role_credential_1.default(roleName);
        }
        return null;
    }
};
//# sourceMappingURL=instance_ram_role_credentials_provider.js.map

/***/ }),

/***/ 746:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const access_key_credential_1 = __importDefault(__nccwpck_require__(9690));
const sts_token_credential_1 = __importDefault(__nccwpck_require__(8370));
const ecs_ram_role_credential_1 = __importDefault(__nccwpck_require__(4993));
const ram_role_arn_credential_1 = __importDefault(__nccwpck_require__(8470));
const rsa_key_pair_credential_1 = __importDefault(__nccwpck_require__(9904));
const bearer_token_credential_1 = __importDefault(__nccwpck_require__(7311));
const utils = __importStar(__nccwpck_require__(381));
const fs_1 = __importDefault(__nccwpck_require__(5747));
const config_1 = __importDefault(__nccwpck_require__(1140));
const DEFAULT_PATH = '~/.alibabacloud/credentials';
exports.default = {
    getCredential(credentialName = 'default') {
        let fileContent = null;
        const credentialFile = process.env.ALIBABA_CLOUD_CREDENTIALS_FILE;
        if (credentialFile === undefined) {
            if (fs_1.default.existsSync(DEFAULT_PATH)) {
                const content = utils.parseFile(DEFAULT_PATH, true);
                if (content) {
                    fileContent = content;
                }
            }
        }
        else {
            if (credentialFile === null || credentialFile === '') {
                throw new Error('Environment variable credentialFile cannot be empty');
            }
            if (!fs_1.default.existsSync(credentialFile)) {
                throw new Error(`credentialFile ${credentialFile} cannot be empty`);
            }
            fileContent = utils.parseFile(credentialFile);
        }
        if (!fileContent) {
            return null;
        }
        const config = fileContent[credentialName] || {};
        if (!config.type) {
            throw new Error('Missing required type option in credentialFile');
        }
        switch (config.type) {
            case 'access_key':
                return new access_key_credential_1.default(config.access_key_id, config.access_key_secret);
            case 'sts':
                return new sts_token_credential_1.default(config.access_key_id, config.access_key_secret, config.security_token);
            case 'ecs_ram_role':
                return new ecs_ram_role_credential_1.default(config.role_name);
            case 'ram_role_arn':
                const conf = new config_1.default({
                    roleArn: config.role_arn,
                    accessKeyId: config.access_key_id,
                    accessKeySecret: config.access_key_secret
                });
                return new ram_role_arn_credential_1.default(conf);
            case 'rsa_key_pair':
                return new rsa_key_pair_credential_1.default(config.public_key_id, config.private_key_file);
            case 'bearer':
                return new bearer_token_credential_1.default(config.bearer_token);
            default:
                throw new Error('Invalid type option, support: access_key, sts, ecs_ram_role, ram_role_arn, rsa_key_pair');
        }
    }
};
//# sourceMappingURL=profile_credentials_provider.js.map

/***/ }),

/***/ 3887:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const environment_variable_credentials_provider_1 = __importDefault(__nccwpck_require__(4316));
const profile_credentials_provider_1 = __importDefault(__nccwpck_require__(746));
const instance_ram_role_credentials_provider_1 = __importDefault(__nccwpck_require__(1897));
const defaultProviders = [
    environment_variable_credentials_provider_1.default,
    profile_credentials_provider_1.default,
    instance_ram_role_credentials_provider_1.default
];
function getCredentials(providers = null) {
    const providerChain = providers || defaultProviders;
    for (const provider of providerChain) {
        const credential = provider.getCredential();
        if (credential) {
            return credential;
        }
    }
    return null;
}
exports.getCredentials = getCredentials;
//# sourceMappingURL=provider_chain.js.map

/***/ }),

/***/ 8470:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const session_credential_1 = __importDefault(__nccwpck_require__(6056));
const http_1 = __nccwpck_require__(2291);
const config_1 = __importDefault(__nccwpck_require__(1140));
class RamRoleArnCredential extends session_credential_1.default {
    constructor(config, runtime = {}) {
        if (!config.accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for ram_role_arn');
        }
        if (!config.accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for ram_role_arn');
        }
        if (!config.roleArn) {
            throw new Error('Missing required roleArn option in config for ram_role_arn');
        }
        const conf = new config_1.default({
            type: 'ram_role_arn',
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
        });
        super(conf);
        this.roleArn = config.roleArn;
        this.policy = config.policy;
        this.durationSeconds = config.roleSessionExpiration || 3600;
        this.roleSessionName = config.roleSessionName || 'role_session_name';
        this.runtime = runtime || {};
        this.host = 'https://sts.aliyuncs.com';
    }
    async updateCredential() {
        const params = {
            accessKeyId: this.accessKeyId,
            roleArn: this.roleArn,
            action: 'AssumeRole',
            durationSeconds: this.durationSeconds,
            roleSessionName: this.roleSessionName
        };
        if (this.policy) {
            params.policy = this.policy;
        }
        const json = await http_1.request(this.host, params, this.runtime, this.accessKeySecret);
        this.sessionCredential = json.Credentials;
    }
}
exports.default = RamRoleArnCredential;
//# sourceMappingURL=ram_role_arn_credential.js.map

/***/ }),

/***/ 9904:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __importDefault(__nccwpck_require__(5747));
const session_credential_1 = __importDefault(__nccwpck_require__(6056));
const utils = __importStar(__nccwpck_require__(381));
const http_1 = __nccwpck_require__(2291);
const config_1 = __importDefault(__nccwpck_require__(1140));
const SECURITY_CRED_URL = 'http://100.100.100.200/latest/meta-data/ram/security-credentials/';
class RsaKeyPairCredential extends session_credential_1.default {
    constructor(publicKeyId, privateKeyFile) {
        if (!publicKeyId) {
            throw new Error('Missing required publicKeyId option in config for rsa_key_pair');
        }
        if (!privateKeyFile) {
            throw new Error('Missing required privateKeyFile option in config for rsa_key_pair');
        }
        if (!fs_1.default.existsSync(privateKeyFile)) {
            throw new Error(`privateKeyFile ${privateKeyFile} cannot be empty`);
        }
        const conf = new config_1.default({
            type: 'rsa_key_pair'
        });
        super(conf);
        this.privateKey = utils.parseFile(privateKeyFile);
        this.publicKeyId = publicKeyId;
    }
    async updateCredential() {
        const url = SECURITY_CRED_URL + this.roleName;
        const json = await http_1.request(url, {
            accessKeyId: this.publicKeyId,
            action: 'GenerateSessionAccessKey',
            durationSeconds: 3600,
            signatureMethod: 'SHA256withRSA',
            signatureType: 'PRIVATEKEY',
        }, {}, this.privateKey);
        this.sessionCredential = json.Credentials;
    }
}
exports.default = RsaKeyPairCredential;
//# sourceMappingURL=rsa_key_pair_credential.js.map

/***/ }),

/***/ 6056:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(6495));
const utils = __importStar(__nccwpck_require__(381));
const config_1 = __importDefault(__nccwpck_require__(1140));
class SessionCredential extends default_credential_1.default {
    constructor(config) {
        const conf = new config_1.default({
            type: config.type,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
        });
        super(conf);
        this.sessionCredential = null;
        this.durationSeconds = config.durationSeconds || 3600;
    }
    async updateCredential() {
        throw new Error('need implemented in sub-class');
    }
    async ensureCredential() {
        const needUpdate = this.needUpdateCredential();
        if (needUpdate) {
            await this.updateCredential();
        }
    }
    async getAccessKeyId() {
        await this.ensureCredential();
        return this.sessionCredential.AccessKeyId;
    }
    async getAccessKeySecret() {
        await this.ensureCredential();
        return this.sessionCredential.AccessKeySecret;
    }
    async getSecurityToken() {
        await this.ensureCredential();
        return this.sessionCredential.SecurityToken;
    }
    needUpdateCredential() {
        if (!this.sessionCredential || !this.sessionCredential.Expiration || !this.sessionCredential.AccessKeyId || !this.sessionCredential.AccessKeySecret || !this.sessionCredential.SecurityToken) {
            return true;
        }
        const expireTime = utils.timestamp(new Date(), this.durationSeconds * 0.05 * 1000);
        if (this.sessionCredential.Expiration < expireTime) {
            return true;
        }
        return false;
    }
}
exports.default = SessionCredential;
//# sourceMappingURL=session_credential.js.map

/***/ }),

/***/ 8370:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const default_credential_1 = __importDefault(__nccwpck_require__(6495));
const config_1 = __importDefault(__nccwpck_require__(1140));
class StsTokenCredential extends default_credential_1.default {
    constructor(accessKeyId, accessKeySecret, securityToken) {
        if (!accessKeyId) {
            throw new Error('Missing required accessKeyId option in config for sts');
        }
        if (!accessKeySecret) {
            throw new Error('Missing required accessKeySecret option in config for sts');
        }
        if (!securityToken) {
            throw new Error('Missing required securityToken option in config for sts');
        }
        const conf = new config_1.default({
            type: 'sts',
            accessKeyId,
            accessKeySecret,
            securityToken
        });
        super(conf);
    }
}
exports.default = StsTokenCredential;
//# sourceMappingURL=sts_token_credential.js.map

/***/ }),

/***/ 7778:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const kitx_1 = __importDefault(__nccwpck_require__(8683));
const path_1 = __importDefault(__nccwpck_require__(5622));
const pkg = kitx_1.default.loadJSONSync(path_1.default.join(__dirname, '../../package.json'));
exports.DEFAULT_UA = `AlibabaCloud (${os.platform()}; ${os.arch()}) ` +
    `Node.js/${process.version} Core/${pkg.version}`;
exports.DEFAULT_CLIENT = `Node.js(${process.version}), ${pkg.name}: ${pkg.version}`;
//# sourceMappingURL=helper.js.map

/***/ }),

/***/ 2291:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const httpx_1 = __importDefault(__nccwpck_require__(9074));
const kitx = __importStar(__nccwpck_require__(8683));
const helper = __importStar(__nccwpck_require__(7778));
const utils = __importStar(__nccwpck_require__(381));
const STATUS_CODE = new Set([200, '200', 'OK', 'Success']);
function firstLetterUpper(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
function formatParams(params) {
    const keys = Object.keys(params);
    const newParams = {};
    for (const key of keys) {
        newParams[firstLetterUpper(key)] = params[key];
    }
    return newParams;
}
function encode(str) {
    const result = encodeURIComponent(str);
    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
function replaceRepeatList(target, key, repeat) {
    for (let i = 0; i < repeat.length; i++) {
        const item = repeat[i];
        if (item && typeof item === 'object') {
            const keys = Object.keys(item);
            for (const itemKey of keys) {
                target[`${key}.${i + 1}.${itemKey}`] = item[itemKey];
            }
        }
        else {
            target[`${key}.${i + 1}`] = item;
        }
    }
}
function flatParams(params) {
    const target = {};
    const keys = Object.keys(params);
    for (const key of keys) {
        const value = params[key];
        if (Array.isArray(value)) {
            replaceRepeatList(target, key, value);
        }
        else {
            target[key] = value;
        }
    }
    return target;
}
function normalize(params) {
    const list = [];
    const flated = flatParams(params);
    const keys = Object.keys(flated).sort();
    for (const key of keys) {
        const value = flated[key];
        list.push([encode(key), encode(value)]); // push []
    }
    return list;
}
function canonicalize(normalized) {
    const fields = [];
    for (const [key, value] of normalized) {
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}
function _buildParams() {
    const defaultParams = {
        Format: 'JSON',
        SignatureMethod: 'HMAC-SHA1',
        SignatureNonce: kitx.makeNonce(),
        SignatureVersion: '1.0',
        Timestamp: utils.timestamp(),
        Version: '2015-04-01',
        RegionId: 'cn-hangzhou'
    };
    return defaultParams;
}
async function request(host, params = {}, opts = {}, accessKeySecret) {
    // 1. compose params and opts
    let options = Object.assign({ headers: {
            'x-sdk-client': helper.DEFAULT_CLIENT,
            'user-agent': helper.DEFAULT_UA
        } }, opts);
    // format params until formatParams is false
    if (options.formatParams !== false) {
        params = formatParams(params);
    }
    params = Object.assign(Object.assign({}, _buildParams()), params);
    // 2. calculate signature
    const method = (opts.method || 'GET').toUpperCase();
    const normalized = normalize(params);
    const canonicalized = canonicalize(normalized);
    // 2.1 get string to sign
    const stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
    // 2.2 get signature
    const key = accessKeySecret + '&';
    const signature = kitx.sha1(stringToSign, key, 'base64');
    // add signature
    normalized.push(['Signature', encode(signature)]);
    // 3. generate final url
    const url = opts.method === 'POST' ? `${host}/` : `${host}/?${canonicalize(normalized)}`;
    // 4. send request
    if (opts.method === 'POST') {
        opts.headers = opts.headers || {};
        opts.headers['content-type'] = 'application/x-www-form-urlencoded';
        opts.data = canonicalize(normalized);
    }
    const response = await httpx_1.default.request(url, opts);
    const buffer = await httpx_1.default.read(response, 'utf8');
    const json = JSON.parse(buffer);
    if (json.Code && !STATUS_CODE.has(json.Code)) {
        const err = new Error(`${json.Message}`);
        err.name = json.Code + 'Error';
        err.data = json;
        err.code = json.Code;
        err.url = url;
        throw err;
    }
    return json;
}
exports.request = request;
//# sourceMappingURL=http.js.map

/***/ }),

/***/ 381:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ini = __importStar(__nccwpck_require__(8885));
const kitx = __importStar(__nccwpck_require__(8683));
const fs_1 = __importDefault(__nccwpck_require__(5747));
function timestamp(dateStr, timeChange) {
    let date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) {
        date = new Date();
    }
    if (timeChange) {
        date.setTime(date.getTime() + timeChange);
    }
    const YYYY = date.getUTCFullYear();
    const MM = kitx.pad2(date.getUTCMonth() + 1);
    const DD = kitx.pad2(date.getUTCDate());
    const HH = kitx.pad2(date.getUTCHours());
    const mm = kitx.pad2(date.getUTCMinutes());
    const ss = kitx.pad2(date.getUTCSeconds());
    // 删除掉毫秒部分
    return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
}
exports.timestamp = timestamp;
function parseFile(file, ignoreErr = false) {
    // check read permission
    try {
        fs_1.default.accessSync(file, fs_1.default.constants.R_OK);
    }
    catch (e) {
        if (ignoreErr) {
            return null;
        }
        throw new Error('Has no read permission to credentials file');
    }
    return ini.parse(fs_1.default.readFileSync(file, 'utf-8'));
}
exports.parseFile = parseFile;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 2306:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Client = /** @class */ (function () {
    function Client() {
    }
    Client.getEndpointRules = function (product, regionId, endpointType, network, suffix) {
        var result;
        if (network && network.length && network != "public") {
            network = "-" + network;
        }
        else {
            network = "";
        }
        suffix = suffix || "";
        if (suffix.length) {
            suffix = "-" + suffix;
        }
        if (endpointType == "regional") {
            if (!regionId || !regionId.length) {
                throw new Error("RegionId is empty, please set a valid RegionId");
            }
            result = "" + product + suffix + network + "." + regionId + ".aliyuncs.com";
        }
        else {
            result = "" + product + suffix + network + ".aliyuncs.com";
        }
        return result;
    };
    return Client;
}());
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 6642:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Params = exports.OpenApiRequest = exports.Config = void 0;
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi SDK
 */
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const credentials_1 = __importStar(__nccwpck_require__(595)), $Credential = credentials_1;
const openapi_util_1 = __importDefault(__nccwpck_require__(2868));
const $tea = __importStar(__nccwpck_require__(4165));
/**
 * Model for initing client
 */
class Config extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            accessKeyId: 'accessKeyId',
            accessKeySecret: 'accessKeySecret',
            securityToken: 'securityToken',
            protocol: 'protocol',
            regionId: 'regionId',
            readTimeout: 'readTimeout',
            connectTimeout: 'connectTimeout',
            httpProxy: 'httpProxy',
            httpsProxy: 'httpsProxy',
            credential: 'credential',
            endpoint: 'endpoint',
            noProxy: 'noProxy',
            maxIdleConns: 'maxIdleConns',
            network: 'network',
            userAgent: 'userAgent',
            suffix: 'suffix',
            socks5Proxy: 'socks5Proxy',
            socks5NetWork: 'socks5NetWork',
            endpointType: 'endpointType',
            openPlatformEndpoint: 'openPlatformEndpoint',
            type: 'type',
            signatureAlgorithm: 'signatureAlgorithm',
        };
    }
    static types() {
        return {
            accessKeyId: 'string',
            accessKeySecret: 'string',
            securityToken: 'string',
            protocol: 'string',
            regionId: 'string',
            readTimeout: 'number',
            connectTimeout: 'number',
            httpProxy: 'string',
            httpsProxy: 'string',
            credential: credentials_1.default,
            endpoint: 'string',
            noProxy: 'string',
            maxIdleConns: 'number',
            network: 'string',
            userAgent: 'string',
            suffix: 'string',
            socks5Proxy: 'string',
            socks5NetWork: 'string',
            endpointType: 'string',
            openPlatformEndpoint: 'string',
            type: 'string',
            signatureAlgorithm: 'string',
        };
    }
}
exports.Config = Config;
class OpenApiRequest extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            headers: 'headers',
            query: 'query',
            body: 'body',
            stream: 'stream',
        };
    }
    static types() {
        return {
            headers: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            query: { 'type': 'map', 'keyType': 'string', 'valueType': 'string' },
            body: 'any',
            stream: 'Readable',
        };
    }
}
exports.OpenApiRequest = OpenApiRequest;
class Params extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            action: 'action',
            version: 'version',
            protocol: 'protocol',
            pathname: 'pathname',
            method: 'method',
            authType: 'authType',
            bodyType: 'bodyType',
            reqBodyType: 'reqBodyType',
            style: 'style',
        };
    }
    static types() {
        return {
            action: 'string',
            version: 'string',
            protocol: 'string',
            pathname: 'string',
            method: 'string',
            authType: 'string',
            bodyType: 'string',
            reqBodyType: 'string',
            style: 'string',
        };
    }
}
exports.Params = Params;
class Client {
    /**
     * Init client with Config
     * @param config config contains the necessary information to create a client
     */
    constructor(config) {
        if (tea_util_1.default.isUnset($tea.toMap(config))) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config' can not be unset",
            });
        }
        if (!tea_util_1.default.empty(config.accessKeyId) && !tea_util_1.default.empty(config.accessKeySecret)) {
            if (!tea_util_1.default.empty(config.securityToken)) {
                config.type = "sts";
            }
            else {
                config.type = "access_key";
            }
            let credentialConfig = new $Credential.Config({
                accessKeyId: config.accessKeyId,
                type: config.type,
                accessKeySecret: config.accessKeySecret,
                securityToken: config.securityToken,
            });
            this._credential = new credentials_1.default(credentialConfig);
        }
        else if (!tea_util_1.default.isUnset(config.credential)) {
            this._credential = config.credential;
        }
        this._endpoint = config.endpoint;
        this._endpointType = config.endpointType;
        this._protocol = config.protocol;
        this._regionId = config.regionId;
        this._userAgent = config.userAgent;
        this._readTimeout = config.readTimeout;
        this._connectTimeout = config.connectTimeout;
        this._httpProxy = config.httpProxy;
        this._httpsProxy = config.httpsProxy;
        this._noProxy = config.noProxy;
        this._socks5Proxy = config.socks5Proxy;
        this._socks5NetWork = config.socks5NetWork;
        this._maxIdleConns = config.maxIdleConns;
        this._signatureAlgorithm = config.signatureAlgorithm;
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doRPCRequest(action, version, protocol, method, authType, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = "/";
                request_.query = Object.assign({ Action: action, Format: "json", Version: version, Timestamp: openapi_util_1.default.getTimestamp(), SignatureNonce: tea_util_1.default.getNonce() }, request.query);
                let headers = this.getRpcHeaders();
                if (tea_util_1.default.isUnset(headers)) {
                    // endpoint is setted in product client
                    request_.headers = {
                        host: this._endpoint,
                        'x-acs-version': version,
                        'x-acs-action': action,
                        'user-agent': this.getUserAgent(),
                    };
                }
                else {
                    request_.headers = Object.assign({ host: this._endpoint, 'x-acs-version': version, 'x-acs-action': action, 'user-agent': this.getUserAgent() }, headers);
                }
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    let tmp = tea_util_1.default.anyifyMapValue(openapi_util_1.default.query(m));
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toFormString(tmp));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.query["SecurityToken"] = securityToken;
                    }
                    request_.query["SignatureMethod"] = "HMAC-SHA1";
                    request_.query["SignatureVersion"] = "1.0";
                    request_.query["AccessKeyId"] = accessKeyId;
                    let t = null;
                    if (!tea_util_1.default.isUnset(request.body)) {
                        t = tea_util_1.default.assertAsMap(request.body);
                    }
                    let signedParam = Object.assign(Object.assign({}, request_.query), openapi_util_1.default.query(t));
                    request_.query["Signature"] = openapi_util_1.default.getRPCSignature(signedParam, request_.method, accessKeySecret);
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    let requestId = Client.defaultAny(err["RequestId"], err["requestId"]);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${requestId}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequest(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                request_.headers = Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    request_.body = new $tea.BytesReadable(tea_util_1.default.toJSONString(request.body));
                    request_.headers["content-type"] = "application/json; charset=utf-8";
                }
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = request.query;
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    let requestId = Client.defaultAny(err["RequestId"], err["requestId"]);
                    requestId = Client.defaultAny(requestId, err["requestid"]);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${requestId}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network with form body
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param pathname pathname of every api
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doROARequestWithForm(action, version, protocol, method, authType, pathname, bodyType, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, protocol);
                request_.method = method;
                request_.pathname = pathname;
                request_.headers = Object.assign({ date: tea_util_1.default.getDateUTCString(), host: this._endpoint, accept: "application/json", 'x-acs-signature-nonce': tea_util_1.default.getNonce(), 'x-acs-signature-method': "HMAC-SHA1", 'x-acs-signature-version': "1.0", 'x-acs-version': version, 'x-acs-action': action, 'user-agent': tea_util_1.default.getUserAgent(this._userAgent) }, request.headers);
                if (!tea_util_1.default.isUnset(request.body)) {
                    let m = tea_util_1.default.assertAsMap(request.body);
                    request_.body = new $tea.BytesReadable(openapi_util_1.default.toForm(m));
                    request_.headers["content-type"] = "application/x-www-form-urlencoded";
                }
                if (!tea_util_1.default.isUnset(request.query)) {
                    request_.query = request.query;
                }
                if (!tea_util_1.default.equalString(authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-accesskey-id"] = accessKeyId;
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    let stringToSign = openapi_util_1.default.getStringToSign(request_);
                    request_.headers["authorization"] = `acs ${accessKeyId}:${openapi_util_1.default.getROASignature(stringToSign, accessKeySecret)}`;
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.equalNumber(response_.statusCode, 204)) {
                    return {
                        headers: response_.headers,
                    };
                }
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    /**
     * Encapsulate the request and invoke the network
     * @param action api name
     * @param version product version
     * @param protocol http or https
     * @param method e.g. GET
     * @param authType authorization type e.g. AK
     * @param bodyType response body type e.g. String
     * @param request object of OpenApiRequest
     * @param runtime which controls some details of call api, such as retry times
     * @return the response
     */
    async doRequest(params, request, runtime) {
        let _runtime = {
            timeouted: "retry",
            readTimeout: tea_util_1.default.defaultNumber(runtime.readTimeout, this._readTimeout),
            connectTimeout: tea_util_1.default.defaultNumber(runtime.connectTimeout, this._connectTimeout),
            httpProxy: tea_util_1.default.defaultString(runtime.httpProxy, this._httpProxy),
            httpsProxy: tea_util_1.default.defaultString(runtime.httpsProxy, this._httpsProxy),
            noProxy: tea_util_1.default.defaultString(runtime.noProxy, this._noProxy),
            maxIdleConns: tea_util_1.default.defaultNumber(runtime.maxIdleConns, this._maxIdleConns),
            retry: {
                retryable: runtime.autoretry,
                maxAttempts: tea_util_1.default.defaultNumber(runtime.maxAttempts, 3),
            },
            backoff: {
                policy: tea_util_1.default.defaultString(runtime.backoffPolicy, "no"),
                period: tea_util_1.default.defaultNumber(runtime.backoffPeriod, 1),
            },
            ignoreSSL: runtime.ignoreSSL,
        };
        let _lastRequest = null;
        let _now = Date.now();
        let _retryTimes = 0;
        while ($tea.allowRetry(_runtime['retry'], _retryTimes, _now)) {
            if (_retryTimes > 0) {
                let _backoffTime = $tea.getBackoffTime(_runtime['backoff'], _retryTimes);
                if (_backoffTime > 0) {
                    await $tea.sleep(_backoffTime);
                }
            }
            _retryTimes = _retryTimes + 1;
            try {
                let request_ = new $tea.Request();
                request_.protocol = tea_util_1.default.defaultString(this._protocol, params.protocol);
                request_.method = params.method;
                request_.pathname = openapi_util_1.default.getEncodePath(params.pathname);
                request_.query = request.query;
                // endpoint is setted in product client
                request_.headers = Object.assign({ host: this._endpoint, 'x-acs-version': params.version, 'x-acs-action': params.action, 'user-agent': this.getUserAgent(), 'x-acs-date': openapi_util_1.default.getTimestamp(), 'x-acs-signature-nonce': tea_util_1.default.getNonce(), accept: "application/json" }, request.headers);
                let signatureAlgorithm = tea_util_1.default.defaultString(this._signatureAlgorithm, "ACS3-HMAC-SHA256");
                let hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(""), signatureAlgorithm));
                if (!tea_util_1.default.isUnset(request.body)) {
                    if (tea_util_1.default.equalString(params.reqBodyType, "json")) {
                        let jsonObj = tea_util_1.default.toJSONString(request.body);
                        hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(jsonObj), signatureAlgorithm));
                        request_.body = new $tea.BytesReadable(jsonObj);
                    }
                    else {
                        let m = tea_util_1.default.assertAsMap(request.body);
                        let formObj = openapi_util_1.default.toForm(m);
                        hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tea_util_1.default.toBytes(formObj), signatureAlgorithm));
                        request_.body = new $tea.BytesReadable(formObj);
                        request_.headers["content-type"] = "application/x-www-form-urlencoded";
                    }
                }
                if (!tea_util_1.default.isUnset(request.stream)) {
                    let tmp = await tea_util_1.default.readAsBytes(request.stream);
                    hashedRequestPayload = openapi_util_1.default.hexEncode(openapi_util_1.default.hash(tmp, signatureAlgorithm));
                    request_.body = new $tea.BytesReadable(tmp);
                }
                request_.headers["x-acs-content-sha256"] = hashedRequestPayload;
                if (!tea_util_1.default.equalString(params.authType, "Anonymous")) {
                    let accessKeyId = await this.getAccessKeyId();
                    let accessKeySecret = await this.getAccessKeySecret();
                    let securityToken = await this.getSecurityToken();
                    if (!tea_util_1.default.empty(securityToken)) {
                        request_.headers["x-acs-security-token"] = securityToken;
                    }
                    request_.headers["Authorization"] = openapi_util_1.default.getAuthorization(request_, signatureAlgorithm, hashedRequestPayload, accessKeyId, accessKeySecret);
                }
                _lastRequest = request_;
                let response_ = await $tea.doAction(request_, _runtime);
                if (tea_util_1.default.is4xx(response_.statusCode) || tea_util_1.default.is5xx(response_.statusCode)) {
                    let _res = await tea_util_1.default.readAsJSON(response_.body);
                    let err = tea_util_1.default.assertAsMap(_res);
                    throw $tea.newError({
                        code: `${Client.defaultAny(err["Code"], err["code"])}`,
                        message: `code: ${response_.statusCode}, ${Client.defaultAny(err["Message"], err["message"])} request id: ${Client.defaultAny(err["RequestId"], err["requestId"])}`,
                        data: err,
                    });
                }
                if (tea_util_1.default.equalString(params.bodyType, "binary")) {
                    let resp = {
                        body: response_.body,
                        headers: response_.headers,
                    };
                    return resp;
                }
                else if (tea_util_1.default.equalString(params.bodyType, "byte")) {
                    let byt = await tea_util_1.default.readAsBytes(response_.body);
                    return {
                        body: byt,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "string")) {
                    let str = await tea_util_1.default.readAsString(response_.body);
                    return {
                        body: str,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "json")) {
                    let obj = await tea_util_1.default.readAsJSON(response_.body);
                    let res = tea_util_1.default.assertAsMap(obj);
                    return {
                        body: res,
                        headers: response_.headers,
                    };
                }
                else if (tea_util_1.default.equalString(params.bodyType, "array")) {
                    let arr = await tea_util_1.default.readAsJSON(response_.body);
                    return {
                        body: arr,
                        headers: response_.headers,
                    };
                }
                else {
                    return {
                        headers: response_.headers,
                    };
                }
            }
            catch (ex) {
                if ($tea.isRetryable(ex)) {
                    continue;
                }
                throw ex;
            }
        }
        throw $tea.newUnretryableError(_lastRequest);
    }
    async callApi(params, request, runtime) {
        if (tea_util_1.default.isUnset($tea.toMap(params))) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'params' can not be unset",
            });
        }
        if (tea_util_1.default.isUnset(this._signatureAlgorithm) || !tea_util_1.default.equalString(this._signatureAlgorithm, "v2")) {
            return await this.doRequest(params, request, runtime);
        }
        else if (tea_util_1.default.equalString(params.style, "ROA") && tea_util_1.default.equalString(params.reqBodyType, "json")) {
            return await this.doROARequest(params.action, params.version, params.protocol, params.method, params.authType, params.pathname, params.bodyType, request, runtime);
        }
        else if (tea_util_1.default.equalString(params.style, "ROA")) {
            return await this.doROARequestWithForm(params.action, params.version, params.protocol, params.method, params.authType, params.pathname, params.bodyType, request, runtime);
        }
        else {
            return await this.doRPCRequest(params.action, params.version, params.protocol, params.method, params.authType, params.bodyType, request, runtime);
        }
    }
    /**
     * Get user agent
     * @return user agent
     */
    getUserAgent() {
        let userAgent = tea_util_1.default.getUserAgent(this._userAgent);
        return userAgent;
    }
    /**
     * Get accesskey id by using credential
     * @return accesskey id
     */
    async getAccessKeyId() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let accessKeyId = await this._credential.getAccessKeyId();
        return accessKeyId;
    }
    /**
     * Get accesskey secret by using credential
     * @return accesskey secret
     */
    async getAccessKeySecret() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let secret = await this._credential.getAccessKeySecret();
        return secret;
    }
    /**
     * Get security token by using credential
     * @return security token
     */
    async getSecurityToken() {
        if (tea_util_1.default.isUnset(this._credential)) {
            return "";
        }
        let token = await this._credential.getSecurityToken();
        return token;
    }
    /**
     * If inputValue is not null, return it or return defaultValue
     * @param inputValue  users input value
     * @param defaultValue default value
     * @return the final result
     */
    static defaultAny(inputValue, defaultValue) {
        if (tea_util_1.default.isUnset(inputValue)) {
            return defaultValue;
        }
        return inputValue;
    }
    /**
     * If the endpointRule and config.endpoint are empty, throw error
     * @param config config contains the necessary information to create a client
     */
    checkConfig(config) {
        if (tea_util_1.default.empty(this._endpointRule) && tea_util_1.default.empty(config.endpoint)) {
            throw $tea.newError({
                code: "ParameterMissing",
                message: "'config.endpoint' can not be empty",
            });
        }
    }
    /**
     * set RPC header for debug
     * @param headers headers for debug, this header can be used only once.
     */
    setRpcHeaders(headers) {
        this._headers = headers;
    }
    /**
     * get RPC header for debug
     */
    getRpcHeaders() {
        let headers = this._headers;
        this._headers = null;
        return headers;
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 2868:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi Util
 */
const $tea = __importStar(__nccwpck_require__(4165));
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const kitx_1 = __importDefault(__nccwpck_require__(8683));
const querystring_1 = __importDefault(__nccwpck_require__(1191));
const crypto_1 = __importDefault(__nccwpck_require__(6417));
const PEM_BEGIN = "-----BEGIN PRIVATE KEY-----\n";
const PEM_END = "\n-----END PRIVATE KEY-----";
function replaceRepeatList(target, repeat, prefix) {
    if (prefix) {
        prefix = prefix + '.';
    }
    for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];
        let key = prefix + (i + 1);
        if (typeof item === 'undefined' || item == null) {
            target[key] = '';
            continue;
        }
        if (Array.isArray(item)) {
            replaceRepeatList(target, item, key);
        }
        else if (item instanceof Object) {
            flatMap(target, item, key);
        }
        else {
            target[key] = item.toString();
        }
    }
}
function flatMap(target, params, prefix = '') {
    if (prefix) {
        prefix = prefix + '.';
    }
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = params[key];
        key = prefix + key;
        if (typeof value === 'undefined' || value == null) {
            target[key] = '';
            continue;
        }
        if (Array.isArray(value)) {
            replaceRepeatList(target, value, key);
        }
        else if (value instanceof Object) {
            flatMap(target, value, key);
        }
        else {
            target[key] = value.toString();
        }
    }
    return target;
}
function filter(value) {
    return value.replace(/[\t\n\r\f]/g, ' ');
}
function getCanonicalizedHeaders(headers) {
    const prefix = 'x-acs-';
    const keys = Object.keys(headers);
    const canonicalizedKeys = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.startsWith(prefix)) {
            canonicalizedKeys.push(key);
        }
    }
    canonicalizedKeys.sort();
    var result = '';
    for (let i = 0; i < canonicalizedKeys.length; i++) {
        const key = canonicalizedKeys[i];
        result += `${key}:${filter(headers[key]).trim()}\n`;
    }
    return result;
}
function getCanonicalizedResource(uriPattern, query) {
    const keys = !query ? [] : Object.keys(query).sort();
    if (keys.length === 0) {
        return uriPattern;
    }
    var result = [];
    for (var i = 0; i < keys.length; i++) {
        const key = keys[i];
        result.push(`${key}=${query[key]}`);
    }
    return `${uriPattern}?${result.join('&')}`;
}
function getAuthorizationQueryString(query) {
    let canonicalQueryArray = [];
    const keys = !query ? [] : Object.keys(query).sort();
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (query[key]) {
            canonicalQueryArray.push(`${key}=${encode(query[key])}`);
        }
        else {
            canonicalQueryArray.push(key);
        }
    }
    return canonicalQueryArray.join('&');
}
function getAuthorizationHeaders(header) {
    let canonicalheaders = "";
    let tmp = {};
    const keys = !header ? [] : Object.keys(header);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const lowerKey = keys[i].toLowerCase();
        if (lowerKey.startsWith("x-acs-") || lowerKey === "host" || lowerKey === "content-type") {
            if (tmp[lowerKey]) {
                tmp[lowerKey].push((header[key] || "").trim());
            }
            else {
                tmp[lowerKey] = [(header[key] || "").trim()];
            }
        }
    }
    var hsKeys = Object.keys(tmp).sort();
    for (let i = 0; i < hsKeys.length; i++) {
        const hsKey = hsKeys[i];
        let listSort = tmp[hsKey].sort();
        canonicalheaders += `${hsKey}:${listSort.join(",")}\n`;
    }
    return { canonicalheaders, hsKeys };
}
function encode(str) {
    var result = encodeURIComponent(str);
    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
function normalize(params) {
    var list = [];
    var flated = {};
    flatMap(flated, params);
    var keys = Object.keys(flated).sort();
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = flated[key];
        list.push([encode(key), encode(value)]);
    }
    return list;
}
function canonicalize(normalized) {
    var fields = [];
    for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}
function isModelClass(t) {
    if (!t) {
        return false;
    }
    return typeof t.types === 'function' && typeof t.names === 'function';
}
function isObjectOrArray(t) {
    return Array.isArray(t) || (t instanceof Object && typeof t !== 'function');
}
function toMap(input) {
    if (!isObjectOrArray(input)) {
        return null;
    }
    else if (input instanceof $tea.Model) {
        return $tea.toMap(input);
    }
    else if (Array.isArray(input)) {
        const result = [];
        input.forEach((value) => {
            if (isObjectOrArray(value)) {
                result.push(toMap(value));
            }
            else {
                result.push(value);
            }
        });
        return result;
    }
    else if (input instanceof Object) {
        const result = {};
        Object.entries(input).forEach(([key, value]) => {
            if (isObjectOrArray(value)) {
                result[key] = toMap(value);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
}
class Client {
    /**
     * Convert all params of body other than type of readable into content
     * @param input source Model
     * @param output target Model
     * @return void
     */
    static convert(input, output) {
        if (!output) {
            return;
        }
        let inputModel = Object.assign({}, input);
        let constructor = output.constructor;
        let types = constructor.types();
        // let constructor = <any>output.constructor;
        for (let key of Object.keys(constructor.names())) {
            if (inputModel[key]) {
                if (isModelClass(types[key])) {
                    output[key] = new types[key](output[key]);
                    Client.convert(inputModel[key], output[key]);
                    continue;
                }
                output[key] = inputModel[key];
            }
        }
    }
    /**
     * Get the string to be signed according to request
     * @param request  which contains signed messages
     * @return the signed string
     */
    static getStringToSign(request) {
        const method = request.method;
        const accept = request.headers['accept'];
        const contentMD5 = request.headers['content-md5'] || '';
        const contentType = request.headers['content-type'] || '';
        const date = request.headers['date'] || '';
        const header = `${method}\n${accept}\n${contentMD5}\n${contentType}\n${date}\n`;
        const canonicalizedHeaders = getCanonicalizedHeaders(request.headers);
        const canonicalizedResource = getCanonicalizedResource(request.pathname, request.query);
        return `${header}${canonicalizedHeaders}${canonicalizedResource}`;
    }
    /**
     * Get signature according to stringToSign, secret
     * @param stringToSign  the signed string
     * @param secret accesskey secret
     * @return the signature
     */
    static getROASignature(stringToSign, secret) {
        const utf8Buff = Buffer.from(stringToSign, 'utf8');
        return kitx_1.default.sha1(utf8Buff, secret, 'base64');
    }
    /**
     * Parse filter into a form string
     * @param filter object
     * @return the string
     */
    static toForm(filter) {
        if (!filter) {
            return '';
        }
        let target = {};
        flatMap(target, filter);
        return tea_util_1.default.toFormString(target);
    }
    /**
     * Get timestamp
     * @return the timestamp string
     */
    static getTimestamp() {
        let date = new Date();
        let YYYY = date.getUTCFullYear();
        let MM = kitx_1.default.pad2(date.getUTCMonth() + 1);
        let DD = kitx_1.default.pad2(date.getUTCDate());
        let HH = kitx_1.default.pad2(date.getUTCHours());
        let mm = kitx_1.default.pad2(date.getUTCMinutes());
        let ss = kitx_1.default.pad2(date.getUTCSeconds());
        return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
    }
    /**
     * Parse filter into a object which's type is map[string]string
     * @param filter query param
     * @return the object
     */
    static query(filter) {
        if (!filter) {
            return {};
        }
        let ret = {};
        flatMap(ret, filter);
        return ret;
    }
    /**
     * Get signature according to signedParams, method and secret
     * @param signedParams params which need to be signed
     * @param method http method e.g. GET
     * @param secret AccessKeySecret
     * @return the signature
     */
    static getRPCSignature(signedParams, method, secret) {
        var normalized = normalize(signedParams);
        var canonicalized = canonicalize(normalized);
        var stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
        const key = secret + '&';
        return kitx_1.default.sha1(stringToSign, key, 'base64');
    }
    /**
     * Parse array into a string with specified style
     * @param array the array
     * @param prefix the prefix string
     * @style specified style e.g. repeatList
     * @return the string
     */
    static arrayToStringWithSpecifiedStyle(array, prefix, style) {
        if (!array) {
            return '';
        }
        if (style === 'repeatList') {
            let target = {};
            replaceRepeatList(target, array, prefix);
            return querystring_1.default.stringify(target, '&&');
        }
        else if (style === 'json') {
            return JSON.stringify(array);
        }
        else if (style === 'simple') {
            return array.join(',');
        }
        else if (style === 'spaceDelimited') {
            return array.join(' ');
        }
        else if (style === 'pipeDelimited') {
            return array.join('|');
        }
        else {
            return '';
        }
    }
    /**
     * Transform input as map.
     */
    static parseToMap(input) {
        return toMap(input);
    }
    static getEndpoint(endpoint, serverUse, endpointType) {
        if (endpointType == "internal") {
            let strs = endpoint.split(".");
            strs[0] += "-internal";
            endpoint = strs.join(".");
        }
        if (serverUse && endpointType == "accelerate") {
            return "oss-accelerate.aliyuncs.com";
        }
        return endpoint;
    }
    /**
    * Encode raw with base16
    * @param raw encoding data
    * @return encoded string
    */
    static hexEncode(raw) {
        return raw.toString("hex");
    }
    /**
     * Hash the raw data with signatureAlgorithm
     * @param raw hashing data
     * @param signatureAlgorithm the autograph method
     * @return hashed bytes
    */
    static hash(raw, signatureAlgorithm) {
        if (signatureAlgorithm === "ACS3-HMAC-SHA256" || signatureAlgorithm === "ACS3-RSA-SHA256") {
            const obj = crypto_1.default.createHash('sha256');
            obj.update(raw);
            return obj.digest();
        }
        else if (signatureAlgorithm == "ACS3-HMAC-SM3") {
            const obj = crypto_1.default.createHash('sm3');
            obj.update(raw);
            return obj.digest();
        }
    }
    static signatureMethod(secret, source, signatureAlgorithm) {
        if (signatureAlgorithm === "ACS3-HMAC-SHA256") {
            const obj = crypto_1.default.createHmac('sha256', secret);
            obj.update(source);
            return obj.digest();
        }
        else if (signatureAlgorithm === "ACS3-HMAC-SM3") {
            const obj = crypto_1.default.createHmac('sm3', secret);
            obj.update(source);
            return obj.digest();
        }
        else if (signatureAlgorithm === "ACS3-RSA-SHA256") {
            if (!secret.startsWith(PEM_BEGIN)) {
                secret = PEM_BEGIN + secret;
            }
            if (!secret.endsWith(PEM_END)) {
                secret = secret + PEM_END;
            }
            var signerObject = crypto_1.default.createSign("RSA-SHA256");
            signerObject.update(source);
            var signature = signerObject.sign({ key: secret, padding: crypto_1.default.constants.RSA_PKCS1_PADDING });
            return signature;
        }
    }
    /**
     * Get the authorization
     * @param request request params
     * @param signatureAlgorithm the autograph method
     * @param payload the hashed request
     * @param acesskey the acesskey string
     * @param accessKeySecret the accessKeySecret string
     * @return authorization string
     */
    static getAuthorization(request, signatureAlgorithm, payload, acesskey, accessKeySecret) {
        const canonicalURI = (request.pathname || "").replace("+", "%20").replace("*", "%2A").replace("%7E", "~");
        const method = request.method;
        const canonicalQueryString = getAuthorizationQueryString(request.query);
        const tuple = getAuthorizationHeaders(request.headers);
        const canonicalheaders = tuple["canonicalheaders"];
        const signedHeaders = tuple["hsKeys"];
        const canonicalRequest = method + "\n" + canonicalURI + "\n" + canonicalQueryString + "\n" + canonicalheaders + "\n" +
            signedHeaders.join(";") + "\n" + payload;
        let raw = Buffer.from(canonicalRequest);
        const stringToSign = signatureAlgorithm + "\n" + Client.hexEncode(Client.hash(raw, signatureAlgorithm));
        const signature = Client.hexEncode(Client.signatureMethod(accessKeySecret, stringToSign, signatureAlgorithm));
        const auth = `${signatureAlgorithm} Credential=${acesskey},SignedHeaders=${signedHeaders.join(';')},Signature=${signature}`;
        return auth;
    }
    static getEncodePath(path) {
        if (typeof path === 'undefined' || path === null) {
            return '';
        }
        let strs = path.split('/');
        for (let i = 0; i < strs.length; i++) {
            strs[i] = encode(strs[i]);
        }
        return strs.join('/');
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 8190:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This file is auto-generated, don't edit it
/**
 * This is for OpenApi Util
 */
const $tea = __importStar(__nccwpck_require__(4165));
const tea_util_1 = __importDefault(__nccwpck_require__(1979));
const kitx_1 = __importDefault(__nccwpck_require__(8683));
const querystring_1 = __importDefault(__nccwpck_require__(1191));
function replaceRepeatList(target, repeat, prefix) {
    if (prefix) {
        prefix = prefix + '.';
    }
    for (var i = 0; i < repeat.length; i++) {
        var item = repeat[i];
        let key = prefix + (i + 1);
        if (typeof item === 'undefined' || item == null) {
            target[key] = '';
            continue;
        }
        if (Array.isArray(item)) {
            replaceRepeatList(target, item, key);
        }
        else if (item instanceof Object) {
            flatMap(target, item, key);
        }
        else {
            target[key] = item.toString();
        }
    }
}
function flatMap(target, params, prefix = '') {
    if (prefix) {
        prefix = prefix + '.';
    }
    let keys = Object.keys(params);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = params[key];
        key = prefix + key;
        if (typeof value === 'undefined' || value == null) {
            target[key] = '';
            continue;
        }
        if (Array.isArray(value)) {
            replaceRepeatList(target, value, key);
        }
        else if (value instanceof Object) {
            flatMap(target, value, key);
        }
        else {
            target[key] = value.toString();
        }
    }
    return target;
}
function filter(value) {
    return value.replace(/[\t\n\r\f]/g, ' ');
}
function getCanonicalizedHeaders(headers) {
    const prefix = 'x-acs-';
    const keys = Object.keys(headers);
    const canonicalizedKeys = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.startsWith(prefix)) {
            canonicalizedKeys.push(key);
        }
    }
    canonicalizedKeys.sort();
    var result = '';
    for (let i = 0; i < canonicalizedKeys.length; i++) {
        const key = canonicalizedKeys[i];
        result += `${key}:${filter(headers[key]).trim()}\n`;
    }
    return result;
}
function getCanonicalizedResource(uriPattern, query) {
    const keys = Object.keys(query).sort();
    if (keys.length === 0) {
        return uriPattern;
    }
    var result = [];
    for (var i = 0; i < keys.length; i++) {
        const key = keys[i];
        result.push(`${key}=${query[key]}`);
    }
    return `${uriPattern}?${result.join('&')}`;
}
function encode(str) {
    var result = encodeURIComponent(str);
    return result.replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}
function normalize(params) {
    var list = [];
    var flated = {};
    flatMap(flated, params);
    var keys = Object.keys(flated).sort();
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = flated[key];
        list.push([encode(key), encode(value)]);
    }
    return list;
}
function canonicalize(normalized) {
    var fields = [];
    for (var i = 0; i < normalized.length; i++) {
        var [key, value] = normalized[i];
        fields.push(key + '=' + value);
    }
    return fields.join('&');
}
function isModelClass(t) {
    if (!t) {
        return false;
    }
    return typeof t.types === 'function' && typeof t.names === 'function';
}
function isObjectOrArray(t) {
    return Array.isArray(t) || (t instanceof Object && typeof t !== 'function');
}
function toMap(input) {
    if (!isObjectOrArray(input)) {
        return null;
    }
    else if (input instanceof $tea.Model) {
        return $tea.toMap(input);
    }
    else if (Array.isArray(input)) {
        const result = [];
        input.forEach((value) => {
            if (isObjectOrArray(value)) {
                result.push(toMap(value));
            }
            else {
                result.push(value);
            }
        });
        return result;
    }
    else if (input instanceof Object) {
        const result = {};
        Object.entries(input).forEach(([key, value]) => {
            if (isObjectOrArray(value)) {
                result[key] = toMap(value);
            }
            else {
                result[key] = value;
            }
        });
        return result;
    }
}
class Client {
    /**
     * Convert all params of body other than type of readable into content
     * @param input source Model
     * @param output target Model
     * @return void
     */
    static convert(input, output) {
        if (!output) {
            return;
        }
        let inputModel = Object.assign({}, input);
        let constructor = output.constructor;
        let types = constructor.types();
        // let constructor = <any>output.constructor;
        for (let key of Object.keys(constructor.names())) {
            if (inputModel[key]) {
                if (isModelClass(types[key])) {
                    output[key] = new types[key](output[key]);
                    Client.convert(inputModel[key], output[key]);
                    continue;
                }
                output[key] = inputModel[key];
            }
        }
    }
    /**
     * Get the string to be signed according to request
     * @param request  which contains signed messages
     * @return the signed string
     */
    static getStringToSign(request) {
        const method = request.method;
        const accept = request.headers['accept'];
        const contentMD5 = request.headers['content-md5'] || '';
        const contentType = request.headers['content-type'] || '';
        const date = request.headers['date'] || '';
        const header = `${method}\n${accept}\n${contentMD5}\n${contentType}\n${date}\n`;
        const canonicalizedHeaders = getCanonicalizedHeaders(request.headers);
        const canonicalizedResource = getCanonicalizedResource(request.pathname, request.query);
        return `${header}${canonicalizedHeaders}${canonicalizedResource}`;
    }
    /**
     * Get signature according to stringToSign, secret
     * @param stringToSign  the signed string
     * @param secret accesskey secret
     * @return the signature
     */
    static getROASignature(stringToSign, secret) {
        const utf8Buff = Buffer.from(stringToSign, 'utf8');
        return kitx_1.default.sha1(utf8Buff, secret, 'base64');
    }
    /**
     * Parse filter into a form string
     * @param filter object
     * @return the string
     */
    static toForm(filter) {
        if (!filter) {
            return '';
        }
        let target = {};
        flatMap(target, filter);
        return tea_util_1.default.toFormString(target);
    }
    /**
     * Get timestamp
     * @return the timestamp string
     */
    static getTimestamp() {
        let date = new Date();
        let YYYY = date.getUTCFullYear();
        let MM = kitx_1.default.pad2(date.getUTCMonth() + 1);
        let DD = kitx_1.default.pad2(date.getUTCDate());
        let HH = kitx_1.default.pad2(date.getUTCHours());
        let mm = kitx_1.default.pad2(date.getUTCMinutes());
        let ss = kitx_1.default.pad2(date.getUTCSeconds());
        return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}Z`;
    }
    /**
     * Parse filter into a object which's type is map[string]string
     * @param filter query param
     * @return the object
     */
    static query(filter) {
        if (!filter) {
            return {};
        }
        let ret = {};
        flatMap(ret, filter);
        return ret;
    }
    /**
     * Get signature according to signedParams, method and secret
     * @param signedParams params which need to be signed
     * @param method http method e.g. GET
     * @param secret AccessKeySecret
     * @return the signature
     */
    static getRPCSignature(signedParams, method, secret) {
        var normalized = normalize(signedParams);
        var canonicalized = canonicalize(normalized);
        var stringToSign = `${method}&${encode('/')}&${encode(canonicalized)}`;
        const key = secret + '&';
        return kitx_1.default.sha1(stringToSign, key, 'base64');
    }
    /**
     * Parse array into a string with specified style
     * @param array the array
     * @param prefix the prefix string
     * @style specified style e.g. repeatList
     * @return the string
     */
    static arrayToStringWithSpecifiedStyle(array, prefix, style) {
        if (!array) {
            return '';
        }
        if (style === 'repeatList') {
            let target = {};
            replaceRepeatList(target, array, prefix);
            return querystring_1.default.stringify(target, '&&');
        }
        else if (style === 'json') {
            return JSON.stringify(array);
        }
        else if (style === 'simple') {
            return array.join(',');
        }
        else if (style === 'spaceDelimited') {
            return array.join(' ');
        }
        else if (style === 'pipeDelimited') {
            return array.join('|');
        }
        else {
            return '';
        }
    }
    /**
     * Transform input as map.
     */
    static parseToMap(input) {
        return toMap(input);
    }
    static getEndpoint(endpoint, serverUse, endpointType) {
        if (endpointType == "internal") {
            let strs = endpoint.split(".");
            strs[0] += "-internal";
            endpoint = strs.join(".");
        }
        if (serverUse && endpointType == "accelerate") {
            return "oss-accelerate.aliyuncs.com";
        }
        return endpoint;
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 4165:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var querystring = __importStar(__nccwpck_require__(1191));
var stream_1 = __nccwpck_require__(2413);
var httpx = __importStar(__nccwpck_require__(9074));
var url_1 = __nccwpck_require__(8835);
var BytesReadable = /** @class */ (function (_super) {
    __extends(BytesReadable, _super);
    function BytesReadable(value) {
        var _this = _super.call(this) || this;
        if (typeof value === 'string') {
            _this.value = Buffer.from(value);
        }
        else if (Buffer.isBuffer(value)) {
            _this.value = value;
        }
        return _this;
    }
    BytesReadable.prototype._read = function () {
        this.push(this.value);
        this.push(null);
    };
    return BytesReadable;
}(stream_1.Readable));
exports.BytesReadable = BytesReadable;
var Request = /** @class */ (function () {
    function Request() {
        this.headers = {};
        this.query = {};
    }
    return Request;
}());
exports.Request = Request;
var Response = /** @class */ (function () {
    function Response(httpResponse) {
        this.statusCode = httpResponse.statusCode;
        this.statusMessage = httpResponse.statusMessage;
        this.headers = this.convertHeaders(httpResponse.headers);
        this.body = httpResponse;
    }
    Response.prototype.convertHeaders = function (headers) {
        var results = {};
        var keys = Object.keys(headers);
        for (var index = 0; index < keys.length; index++) {
            var key = keys[index];
            results[key] = headers[key];
        }
        return results;
    };
    Response.prototype.readBytes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, httpx.read(this.body, '')];
                    case 1:
                        buff = _a.sent();
                        return [2 /*return*/, buff];
                }
            });
        });
    };
    return Response;
}());
exports.Response = Response;
function buildURL(request) {
    var url = request.protocol + "://" + request.headers['host'];
    if (request.port) {
        url += ":" + request.port;
    }
    url += "" + request.pathname;
    var urlInfo = url_1.parse(url);
    if (request.query && Object.keys(request.query).length > 0) {
        if (urlInfo.query) {
            url += "&" + querystring.stringify(request.query);
        }
        else {
            url += "?" + querystring.stringify(request.query);
        }
    }
    return url;
}
function isModelClass(t) {
    if (!t) {
        return false;
    }
    return typeof t.types === 'function' && typeof t.names === 'function';
}
function doAction(request, runtime) {
    if (runtime === void 0) { runtime = null; }
    return __awaiter(this, void 0, void 0, function () {
        var url, method, options, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = buildURL(request);
                    method = (request.method || 'GET').toUpperCase();
                    options = {
                        method: method,
                        headers: request.headers
                    };
                    if (method !== 'GET' && method !== 'HEAD') {
                        options.data = request.body;
                    }
                    if (runtime) {
                        if (typeof runtime.timeout !== 'undefined') {
                            options.timeout = Number(runtime.timeout);
                        }
                        if (typeof runtime.readTimeout !== 'undefined') {
                            options.readTimeout = Number(runtime.readTimeout);
                        }
                        if (typeof runtime.connectTimeout !== 'undefined') {
                            options.connectTimeout = Number(runtime.connectTimeout);
                        }
                        if (typeof runtime.ignoreSSL !== 'undefined') {
                            options.rejectUnauthorized = !runtime.ignoreSSL;
                        }
                        if (typeof runtime.key !== 'undefined') {
                            options.key = String(runtime.key);
                        }
                        if (typeof runtime.cert !== 'undefined') {
                            options.cert = String(runtime.cert);
                        }
                        if (typeof runtime.ca !== 'undefined') {
                            options.ca = String(runtime.ca);
                        }
                    }
                    return [4 /*yield*/, httpx.request(url, options)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, new Response(response)];
            }
        });
    });
}
exports.doAction = doAction;
function newError(data) {
    var message = data.code + ": " + data.message;
    return new Error(message);
}
exports.newError = newError;
function getValue(type, value) {
    if (typeof type === 'string') {
        // basic type
        return value;
    }
    if (type.type === 'array') {
        if (!Array.isArray(value)) {
            throw new Error("expect: array, actual: " + typeof value);
        }
        return value.map(function (item) {
            return getValue(type.itemType, item);
        });
    }
    if (typeof type === 'function') {
        if (isModelClass(type)) {
            return new type(value);
        }
        return value;
    }
    return value;
}
function toMap(value) {
    if (value === void 0) { value = undefined; }
    if (typeof value === 'undefined' || value == null) {
        return null;
    }
    if (value instanceof Model) {
        return value.toMap();
    }
    if (Array.isArray(value)) {
        return value.map(function (item) {
            return toMap(item);
        });
    }
    return value;
}
exports.toMap = toMap;
var Model = /** @class */ (function () {
    function Model(map) {
        var _this = this;
        if (map == null) {
            return;
        }
        var clz = this.constructor;
        var names = clz.names();
        var types = clz.types();
        Object.keys(names).forEach((function (name) {
            var value = map[name];
            if (value === undefined || value === null) {
                return;
            }
            var type = types[name];
            _this[name] = getValue(type, value);
        }));
    }
    Model.prototype.toMap = function () {
        var _this = this;
        var map = {};
        var clz = this.constructor;
        var names = clz.names();
        Object.keys(names).forEach((function (name) {
            var originName = names[name];
            var value = _this[name];
            if (typeof value === 'undefined' || value == null) {
                return;
            }
            map[originName] = toMap(value);
        }));
        return map;
    };
    return Model;
}());
exports.Model = Model;
function cast(obj, t) {
    if (!obj) {
        throw new Error('can not cast to Map');
    }
    if (typeof obj !== 'object') {
        throw new Error('can not cast to Map');
    }
    var map = obj;
    var clz = t.constructor;
    var names = clz.names();
    var types = clz.types();
    Object.keys(names).forEach(function (key) {
        var originName = names[key];
        var value = map[originName];
        var type = types[key];
        if (typeof value === 'undefined' || value == null) {
            return;
        }
        if (typeof type === 'string') {
            if (type === 'Readable' ||
                type === 'map' ||
                type === 'Buffer' ||
                type === 'any' ||
                typeof value === type) {
                t[key] = value;
                return;
            }
            if (type === 'string' &&
                (typeof value === 'number' ||
                    typeof value === 'boolean')) {
                t[key] = value.toString();
                return;
            }
            if (type === 'boolean') {
                if (value === 1 || value === 0) {
                    t[key] = !!value;
                    return;
                }
                if (value === 'true' || value === 'false') {
                    t[key] = value === 'true';
                    return;
                }
            }
            if (type === 'number' && typeof value === 'string') {
                if (value.match(/^\d*$/)) {
                    t[key] = parseInt(value);
                    return;
                }
                if (value.match(/^[\.\d]*$/)) {
                    t[key] = parseFloat(value);
                    return;
                }
            }
            throw new Error("type of " + key + " is mismatch, expect " + type + ", but " + typeof value);
        }
        else if (type.type === 'map') {
            if (!(value instanceof Object)) {
                throw new Error("type of " + key + " is mismatch, expect object, but " + typeof value);
            }
            t[key] = value;
        }
        else if (type.type === 'array') {
            if (!Array.isArray(value)) {
                throw new Error("type of " + key + " is mismatch, expect array, but " + typeof value);
            }
            if (typeof type.itemType === 'function') {
                t[key] = value.map(function (d) {
                    if (isModelClass(type.itemType)) {
                        return cast(d, new type.itemType({}));
                    }
                    return d;
                });
            }
            else {
                t[key] = value;
            }
        }
        else if (typeof type === 'function') {
            if (!(value instanceof Object)) {
                throw new Error("type of " + key + " is mismatch, expect object, but " + typeof value);
            }
            if (isModelClass(type)) {
                t[key] = cast(value, new type({}));
                return;
            }
            t[key] = value;
        }
        else {
        }
    });
    return t;
}
exports.cast = cast;
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function allowRetry(retry, retryTimes, startTime) {
    // 还未重试
    if (retryTimes === 0) {
        return true;
    }
    if (retry.retryable !== true) {
        return false;
    }
    if (retry.policy === 'never') {
        return false;
    }
    if (retry.policy === 'always') {
        return true;
    }
    if (retry.policy === 'simple') {
        return (retryTimes < retry['maxAttempts']);
    }
    if (retry.policy === 'timeout') {
        return Date.now() - startTime < retry.timeout;
    }
    // 默认不重试
    return false;
}
exports.allowRetry = allowRetry;
function getBackoffTime(backoff, retryTimes) {
    if (retryTimes === 0) {
        // 首次调用，不使用退避策略
        return 0;
    }
    if (backoff.policy === 'no') {
        // 不退避
        return 0;
    }
    if (backoff.policy === 'fixed') {
        // 固定退避
        return backoff.period;
    }
    if (backoff.policy === 'random') {
        // 随机退避
        var min = backoff['minPeriod'];
        var max = backoff['maxPeriod'];
        return min + (max - min) * Math.random();
    }
    if (backoff.policy === 'exponential') {
        // 指数退避
        var init = backoff.initial;
        var multiplier = backoff.multiplier;
        var time = init * Math.pow(1 + multiplier, retryTimes - 1);
        var max = backoff.max;
        return Math.min(time, max);
    }
    if (backoff.policy === 'exponential_random') {
        // 指数随机退避
        var init = backoff.initial;
        var multiplier = backoff.multiplier;
        var time = init * Math.pow(1 + multiplier, retryTimes - 1);
        var max = backoff.max;
        return Math.min(time * (0.5 + Math.random()), max);
    }
    return 0;
}
exports.getBackoffTime = getBackoffTime;
var UnretryableError = /** @class */ (function (_super) {
    __extends(UnretryableError, _super);
    function UnretryableError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'UnretryableError';
        return _this;
    }
    return UnretryableError;
}(Error));
function newUnretryableError(request) {
    var e = new UnretryableError('');
    e.data = {
        lastRequest: request
    };
    return e;
}
exports.newUnretryableError = newUnretryableError;
var RetryError = /** @class */ (function (_super) {
    __extends(RetryError, _super);
    function RetryError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'RetryError';
        return _this;
    }
    return RetryError;
}(Error));
function retryError(request, response) {
    var e = new RetryError('');
    e.data = {
        request: request,
        response: response
    };
    return e;
}
exports.retryError = retryError;
function isRetryable(err) {
    if (typeof err === 'undefined' || err === null) {
        return false;
    }
    return err.name === 'RetryError';
}
exports.isRetryable = isRetryable;
//# sourceMappingURL=tea.js.map

/***/ }),

/***/ 1979:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const $tea = __importStar(__nccwpck_require__(4165));
const kitx = __importStar(__nccwpck_require__(8683));
const querystring_1 = __importDefault(__nccwpck_require__(1191));
const os_1 = __nccwpck_require__(2087);
const DEFAULT_USER_AGENT = `AlibabaCloud (${os_1.platform()}; ${os_1.arch()}) Node.js/${process.version} Core/1.0.1 TeaDSL/1`;
class RuntimeOptions extends $tea.Model {
    constructor(map) {
        super(map);
    }
    static names() {
        return {
            autoretry: 'autoretry',
            ignoreSSL: 'ignoreSSL',
            maxAttempts: 'max_attempts',
            backoffPolicy: 'backoff_policy',
            backoffPeriod: 'backoff_period',
            readTimeout: 'readTimeout',
            connectTimeout: 'connectTimeout',
            httpProxy: 'httpProxy',
            httpsProxy: 'httpsProxy',
            noProxy: 'noProxy',
            maxIdleConns: 'maxIdleConns',
        };
    }
    static types() {
        return {
            autoretry: 'boolean',
            ignoreSSL: 'boolean',
            maxAttempts: 'number',
            backoffPolicy: 'string',
            backoffPeriod: 'number',
            readTimeout: 'number',
            connectTimeout: 'number',
            httpProxy: 'string',
            httpsProxy: 'string',
            noProxy: 'string',
            maxIdleConns: 'number',
        };
    }
}
exports.RuntimeOptions = RuntimeOptions;
function read(readable) {
    return new Promise((resolve, reject) => {
        let onData, onError, onEnd;
        var cleanup = function () {
            // cleanup
            readable.removeListener('error', onError);
            readable.removeListener('data', onData);
            readable.removeListener('end', onEnd);
        };
        var bufs = [];
        var size = 0;
        onData = function (buf) {
            bufs.push(buf);
            size += buf.length;
        };
        onError = function (err) {
            cleanup();
            reject(err);
        };
        onEnd = function () {
            cleanup();
            resolve(Buffer.concat(bufs, size));
        };
        readable.on('error', onError);
        readable.on('data', onData);
        readable.on('end', onEnd);
    });
}
class Client {
    static toString(buff) {
        return buff.toString();
    }
    static parseJSON(text) {
        return JSON.parse(text);
    }
    static async readAsBytes(stream) {
        return await read(stream);
    }
    static async readAsString(stream) {
        let buff = await Client.readAsBytes(stream);
        return Client.toString(buff);
    }
    static async readAsJSON(stream) {
        return Client.parseJSON(await Client.readAsString(stream));
    }
    static getNonce() {
        return kitx.makeNonce();
    }
    static getDateUTCString() {
        const now = new Date();
        return now.toUTCString();
    }
    static defaultString(real, defaultValue) {
        return real || defaultValue;
    }
    static defaultNumber(real, defaultValue) {
        return real || defaultValue;
    }
    static toFormString(val) {
        return querystring_1.default.stringify(val);
    }
    static toJSONString(val) {
        return JSON.stringify(val);
    }
    static toBytes(val) {
        return Buffer.from(val);
    }
    static empty(val) {
        return !val;
    }
    static equalString(val1, val2) {
        return val1 === val2;
    }
    static equalNumber(val1, val2) {
        return val1 === val2;
    }
    static isUnset(value) {
        if (typeof value === 'undefined') {
            return true;
        }
        if (value === null) {
            return true;
        }
        return false;
    }
    static stringifyMapValue(m) {
        if (!m) {
            return m;
        }
        const result = {};
        for (const [key, value] of Object.entries(m)) {
            if (typeof value === 'undefined' || value === null) {
                continue;
            }
            result[key] = String(value);
        }
        return result;
    }
    static anyifyMapValue(m) {
        return m;
    }
    static assertAsBoolean(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        throw new Error(`The value is not a boolean`);
    }
    static assertAsString(value) {
        if (typeof value === 'string') {
            return value;
        }
        throw new Error(`The value is not a string`);
    }
    static assertAsNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        throw new Error(`The value is not a number`);
    }
    static assertAsMap(value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
        throw new Error(`The value is not a object`);
    }
    static assertAsArray(value) {
        if (Array.isArray(value)) {
            return value;
        }
        throw new Error(`The value is not array`);
    }
    static assertAsBytes(value) {
        if (Buffer.isBuffer(value)) {
            return value;
        }
        throw new Error(`The value is not bytes`);
    }
    static getUserAgent(userAgent) {
        if (!userAgent || !userAgent.length) {
            return DEFAULT_USER_AGENT;
        }
        return DEFAULT_USER_AGENT + " " + userAgent;
    }
    static is2xx(code) {
        return code >= 200 && code < 300;
    }
    static is3xx(code) {
        return code >= 300 && code < 400;
    }
    static is4xx(code) {
        return code >= 400 && code < 500;
    }
    static is5xx(code) {
        return code >= 500 && code < 600;
    }
    static validateModel(m) {
    }
    static toMap(inputModel) {
        return $tea.toMap(inputModel);
    }
    static async sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, millisecond);
        });
    }
    static toArray(input) {
        if (!(input instanceof Array)) {
            return null;
        }
        let ret = [];
        input.forEach((model) => {
            if (!model) {
                return;
            }
            ret.push($tea.toMap(model));
        });
        return ret;
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map

/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(900);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(5332);
}


/***/ }),

/***/ 5332:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(3867);
const util = __nccwpck_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(9318);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 1621:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 9074:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const zlib = __nccwpck_require__(8761);
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const parse = __nccwpck_require__(8835).parse;
const format = __nccwpck_require__(8835).format;

const debugBody = __nccwpck_require__(8237)('httpx:body');
const debugHeader = __nccwpck_require__(8237)('httpx:header');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const TIMEOUT = 3000; // 3s

const READ_TIMER = Symbol('TIMER::READ_TIMER');
const READ_TIME_OUT = Symbol('TIMER::READ_TIME_OUT');
const READ_TIMER_START_AT = Symbol('TIMER::READ_TIMER_START_AT');

var append = function (err, name, message) {
  err.name = name + err.name;
  err.message = `${message}. ${err.message}`;
  return err;
};

const isNumber = function (num) {
  return num !== null && !isNaN(num);
};

exports.request = function (url, opts) {
  // request(url)
  opts || (opts = {});

  const parsed = typeof url === 'string' ? parse(url) : url;

  let readTimeout, connectTimeout;
  if (isNumber(opts.readTimeout) || isNumber(opts.connectTimeout)) {
    readTimeout = isNumber(opts.readTimeout) ? Number(opts.readTimeout) : TIMEOUT;
    connectTimeout = isNumber(opts.connectTimeout) ? Number(opts.connectTimeout) : TIMEOUT;
  } else if (isNumber(opts.timeout)) {
    readTimeout = connectTimeout = Number(opts.timeout);
  } else {
    readTimeout = connectTimeout = TIMEOUT;
  }

  const isHttps = parsed.protocol === 'https:';
  const method = (opts.method || 'GET').toUpperCase();
  const defaultAgent = isHttps ? httpsAgent : httpAgent;
  const agent = opts.agent || defaultAgent;

  var options = {
    host: parsed.hostname || 'localhost',
    path: parsed.path || '/',
    method: method,
    port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
    agent: agent,
    headers: opts.headers || {},
    // ssl config
    key: opts.key || '',
    cert: opts.cert || '',
    ca: opts.ca || '',
    // connect timerout
    timeout: connectTimeout
  };

  if (isHttps && typeof opts.rejectUnauthorized !== 'undefined') {
    options.rejectUnauthorized = opts.rejectUnauthorized;
  }

  if (opts.compression) {
    options.headers['accept-encoding'] = 'gzip,deflate';
  }

  const httplib = isHttps ? https : http;

  if (typeof opts.beforeRequest === 'function') {
    options = opts.beforeRequest(options);
  }

  return new Promise((resolve, reject) => {
    const request = httplib.request(options);
    const body = opts.data;

    var fulfilled = (response) => {
      if (debugHeader.enabled) {
        const requestHeaders = response.req._header;
        requestHeaders.split('\r\n').forEach((line) => {
          debugHeader('> %s', line);
        });

        debugHeader('< HTTP/%s %s %s', response.httpVersion, response.statusCode, response.statusMessage);
        Object.keys(response.headers).forEach((key) => {
          debugHeader('< %s: %s', key, response.headers[key]);
        });
      }
      resolve(response);
    };

    var rejected = (err) => {
      err.message += `${method} ${format(parsed)} failed.`;
      // clear response timer when error
      if (request.socket && request.socket[READ_TIMER]) {
        clearTimeout(request.socket[READ_TIMER]);
      }
      reject(err);
    };

    var abort = (err) => {
      request.abort();
      rejected(err);
    };

    const startResponseTimer = function (socket) {
      const timer = setTimeout(() => {
        if (socket[READ_TIMER]) {
          clearTimeout(socket[READ_TIMER]);
          socket[READ_TIMER] = null;
        }
        var err = new Error();
        var message = `ReadTimeout(${readTimeout})`;
        abort(append(err, 'RequestTimeout', message));
      }, readTimeout);
      // start read-timer
      socket[READ_TIME_OUT] = readTimeout;
      socket[READ_TIMER] = timer;
      socket[READ_TIMER_START_AT] = Date.now();
    };

    // string
    if (!body || 'string' === typeof body || body instanceof Buffer) {
      if (debugBody.enabled) {
        if (!body) {
          debugBody('<no request body>');
        } else if ('string' === typeof body) {
          debugBody(body);
        } else {
          debugBody(`Buffer <ignored>, Buffer length: ${body.length}`);
        }
      }
      request.end(body);
    } else if ('function' === typeof body.pipe) { // stream
      body.pipe(request);
      if (debugBody.enabled) {
        debugBody('<request body is a stream>');
      }
      body.once('error', (err) => {
        abort(append(err, 'HttpX', 'Stream occor error'));
      });
    }

    request.on('response', fulfilled);
    request.on('error', rejected);
    request.once('socket', function (socket) {
      // reuse socket
      if (socket.readyState === 'opening') {
        socket.once('connect', function () {
          startResponseTimer(socket);
        });
      } else {
        startResponseTimer(socket);
      }
    });
  });
};

exports.read = function (response, encoding) {
  var readable = response;
  switch (response.headers['content-encoding']) {
  // or, just use zlib.createUnzip() to handle both cases
  case 'gzip':
    readable = response.pipe(zlib.createGunzip());
    break;
  case 'deflate':
    readable = response.pipe(zlib.createInflate());
    break;
  default:
    break;
  }

  return new Promise((resolve, reject) => {
    // node.js 14 use response.client
    const socket = response.socket || response.client;

    const makeReadTimeoutError = () => {
      const req = response.req;
      var err = new Error();
      err.name = 'RequestTimeoutError';
      err.message = `ReadTimeout: ${socket[READ_TIME_OUT]}. ${req.method} ${req.path} failed.`;
      return err;
    };
    // check read-timer
    let readTimer;
    const oldReadTimer = socket[READ_TIMER];
    if (!oldReadTimer) {
      reject(makeReadTimeoutError());
      return;
    }
    const remainTime = socket[READ_TIME_OUT] - (Date.now() - socket[READ_TIMER_START_AT]);
    clearTimeout(oldReadTimer);
    if (remainTime <= 0) {
      reject(makeReadTimeoutError());
      return;
    }
    readTimer = setTimeout(function () {
      reject(makeReadTimeoutError());
    }, remainTime);

    // start reading data
    var onError, onData, onEnd;
    var cleanup = function () {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
      // clear read timer
      if (readTimer) {
        clearTimeout(readTimer);
      }
    };

    const bufs = [];
    var size = 0;

    onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    onError = function (err) {
      cleanup();
      reject(err);
    };

    onEnd = function () {
      cleanup();
      var buff = Buffer.concat(bufs, size);

      debugBody('');
      if (encoding) {
        const result = buff.toString(encoding);
        debugBody(result);
        return resolve(result);
      }

      if (debugBody.enabled) {
        debugBody(buff.toString());
      }
      resolve(buff);
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};


/***/ }),

/***/ 8885:
/***/ ((__unused_webpack_module, exports) => {

exports.parse = exports.decode = decode

exports.stringify = exports.encode = encode

exports.safe = safe
exports.unsafe = unsafe

var eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n'

function encode (obj, opt) {
  var children = []
  var out = ''

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false,
    }
  } else {
    opt = opt || {}
    opt.whitespace = opt.whitespace === true
  }

  var separator = opt.whitespace ? ' = ' : '='

  Object.keys(obj).forEach(function (k, _, __) {
    var val = obj[k]
    if (val && Array.isArray(val)) {
      val.forEach(function (item) {
        out += safe(k + '[]') + separator + safe(item) + '\n'
      })
    } else if (val && typeof val === 'object')
      children.push(k)
    else
      out += safe(k) + separator + safe(val) + eol
  })

  if (opt.section && out.length)
    out = '[' + safe(opt.section) + ']' + eol + out

  children.forEach(function (k, _, __) {
    var nk = dotSplit(k).join('\\.')
    var section = (opt.section ? opt.section + '.' : '') + nk
    var child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace,
    })
    if (out.length && child.length)
      out += eol

    out += child
  })

  return out
}

function dotSplit (str) {
  return str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map(function (part) {
      return part.replace(/\1/g, '\\.')
        .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001')
    })
}

function decode (str) {
  var out = {}
  var p = out
  var section = null
  //          section     |key      = value
  var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  var lines = str.split(/[\r\n]+/g)

  lines.forEach(function (line, _, __) {
    if (!line || line.match(/^\s*[;#]/))
      return
    var match = line.match(re)
    if (!match)
      return
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      if (section === '__proto__') {
        // not allowed
        // keep parsing the section, but don't attach it.
        p = {}
        return
      }
      p = out[section] = out[section] || {}
      return
    }
    var key = unsafe(match[2])
    if (key === '__proto__')
      return
    var value = match[3] ? unsafe(match[4]) : true
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.substring(0, key.length - 2)
      if (key === '__proto__')
        return
      if (!p[key])
        p[key] = []
      else if (!Array.isArray(p[key]))
        p[key] = [p[key]]
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key]))
      p[key].push(value)
    else
      p[key] = value
  })

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k, _, __) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k]))
      return false

    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    var parts = dotSplit(k)
    var p = out
    var l = parts.pop()
    var nl = l.replace(/\\\./g, '.')
    parts.forEach(function (part, _, __) {
      if (part === '__proto__')
        return
      if (!p[part] || typeof p[part] !== 'object')
        p[part] = {}
      p = p[part]
    })
    if (p === out && nl === l)
      return false

    p[nl] = out[k]
    return true
  }).forEach(function (del, _, __) {
    delete out[del]
  })

  return out
}

function isQuoted (val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

function safe (val) {
  return (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
    ? JSON.stringify(val)
    : val.replace(/;/g, '\\;').replace(/#/g, '\\#')
}

function unsafe (val, doUnesc) {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'")
      val = val.substr(1, val.length - 2)

    try {
      val = JSON.parse(val)
    } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    var esc = false
    var unesc = ''
    for (var i = 0, l = val.length; i < l; i++) {
      var c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1)
          unesc += c
        else
          unesc += '\\' + c

        esc = false
      } else if (';#'.indexOf(c) !== -1)
        break
      else if (c === '\\')
        esc = true
      else
        unesc += c
    }
    if (esc)
      unesc += '\\'

    return unesc.trim()
  }
  return val
}


/***/ }),

/***/ 8683:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(5747);
const os = __nccwpck_require__(2087);
const crypto = __nccwpck_require__(6417);

/**
 * Load *.json file synchronous. Don't use require('*.json')
 * to load *.json files, it will cached in process.
 * @param {String} filename absolute file path
 * @return {Object} a parsed object
 */
exports.loadJSONSync = function (filename) {
  // strip BOM
  var content = fs.readFileSync(filename, 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = filename + ': ' + err.message;
    throw err;
  }
};

/**
 * Encoding a string to Buffer safely
 * @param {String} str string.
 * @param {String} encoding. optional.
 * @return {Buffer} encoded buffer
 */
exports.encode = function (str, encoding) {
  if (typeof str !== 'string') {
    str = '' + str;
  }

  return Buffer.from(str, encoding);
};

/**
 * Generate a haser with specfied algorithm
 * @param {String} algorithm can be md5, etc.
 * @return {Function} a haser with specfied algorithm
 */
exports.makeHasher = function (algorithm) {
  return function (data, encoding) {
    var shasum = crypto.createHash(algorithm);
    shasum.update(data);
    return shasum.digest(encoding);
  };
};

exports.createHash = exports.makeHasher;

/**
 * Get md5 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} encoding optional. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.md5 = exports.makeHasher('md5');

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.createHmac = function (algorithm) {
  return function (data, key, encoding) {
    return crypto.createHmac(algorithm, key).update(data).digest(encoding);
  };
};

/**
 * Get sha1 hash digests of data
 * @param {String|Buffer} data data.
 * @param {String} key the key.
 * @param {String} encoding optionnal. can be 'hex', 'binary', 'base64'.
 * @return {String|Buffer} if no encoding is provided, a buffer is returned.
 */
exports.sha1 = exports.createHmac('sha1');

/**
 * Get a random value in a range
 * @param {Number} min range start.
 * @param {Number} max range end.
 */
exports.random = function (min, max) {
  return Math.floor(min + Math.random() * (max - min));
};

/**
 * Generate a nonce string
 * @return {String} a nonce string.
 */
exports.makeNonce = (function () {
  var counter = 0;
  var last;
  const machine = os.hostname();
  const pid = process.pid;

  return function () {
    var val = Math.floor(Math.random() * 1000000000000);
    if (val === last) {
      counter++;
    } else {
      counter = 0;
    }

    last = val;

    var uid = `${machine}${pid}${val}${counter}`;
    return exports.md5(uid, 'hex');
  };
}());

/**
 * Pad a number as \d\d format
 * @param {Number} num a number that less than 100.
 * @return {String} if number less than 10, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad2 = function (num) {
  if (num < 10) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Pad a number as \d\d\d format
 * @param {Number} num a number that less than 1000.
 * @return {String} if number less than 100, pad with 0,
 *  otherwise, returns string of number.
 */
exports.pad3 = function (num) {
  if (num < 10) {
    return '00' + num;
  } else if (num < 100) {
    return '0' + num;
  }
  return '' + num;
};

/**
 * Return the YYYYMMDD format of a date.
 * @param {Date} date a Date object.
 * @return {String} the YYYYMMDD format.
 */
exports.getYYYYMMDD = function (date) {
  var YYYY = date.getFullYear();
  var MM = exports.pad2(date.getMonth() + 1);
  var DD = exports.pad2(date.getDate());
  return '' + YYYY + MM + DD;
};

/**
 * sleep a while.
 * @param {Number} in milliseconds
 * @return {Promise} a Promise
 */
exports.sleep = function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Get the IPv4 address
 * @return {String} the IPv4 address, or empty string
 */
exports.getIPv4 = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.address;
      }
    }
  }

  // without non-internal address
  return '';
};

/**
 * Get the Mac address
 * @return {String} the Mac address
 */
exports.getMac = function () {
  var interfaces = os.networkInterfaces();
  var keys = Object.keys(interfaces);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var addresses = interfaces[key];
    for (var j = 0; j < addresses.length; j++) {
      var item = addresses[j];
      if (!item.internal && item.family === 'IPv4') {
        return item.mac;
      }
    }
  }

  // without non-internal address
  return '00:00:00:00:00:00';
};

/**
 * Read all bytes from a readable
 * @return {Readable} the readable stream
 * @return {Promise} a Promise with all bytes
 */
exports.readAll = function (readable) {
  return new Promise((resolve, reject) => {
    var onError, onData, onEnd;
    var cleanup = function (err) {
      // cleanup
      readable.removeListener('error', onError);
      readable.removeListener('data', onData);
      readable.removeListener('end', onEnd);
    };

    var bufs = [];
    var size = 0;

    onData = function (buf) {
      bufs.push(buf);
      size += buf.length;
    };

    onError = function (err) {
      cleanup();
      reject(err);
    };

    onEnd = function () {
      cleanup();
      resolve(Buffer.concat(bufs, size));
    };

    readable.on('error', onError);
    readable.on('data', onData);
    readable.on('end', onEnd);
  });
};


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __nccwpck_require__(5622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const tty = __nccwpck_require__(3867);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let flagForceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	flagForceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream, options = {}) {
	const level = supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	});

	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel({isTTY: tty.isatty(1)}),
	stderr: getSupportLevel({isTTY: tty.isatty(2)})
};


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 1191:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__nccwpck_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__nccwpck_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__nccwpck_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(2186);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_glob__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(8090);
/* harmony import */ var _actions_glob__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_actions_glob__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(3121);
/* harmony import */ var _alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nccwpck_require__.n(_alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _alicloud_openapi_client__WEBPACK_IMPORTED_MODULE_3__ = __nccwpck_require__(6642);
/* harmony import */ var _alicloud_openapi_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__nccwpck_require__.n(_alicloud_openapi_client__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4__ = __nccwpck_require__(5622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__nccwpck_require__.n(path__WEBPACK_IMPORTED_MODULE_4__);





const processSeparator = path__WEBPACK_IMPORTED_MODULE_4__.sep;
const posixSeparator = path__WEBPACK_IMPORTED_MODULE_4__.posix.sep;
const homeDir = (0,path__WEBPACK_IMPORTED_MODULE_4__.join)(process.cwd(), (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('source', { required: false }) || 'public', processSeparator);
const cdnDomain = (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('cdnDomain', { required: true });
const credentials = new _alicloud_openapi_client__WEBPACK_IMPORTED_MODULE_3__.Config({
    accessKeyId: (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('accessKeyId', { required: true }),
    accessKeySecret: (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput)('accessKeySecret', { required: true }),
});
const client = new (_alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2___default())(credentials);
function objectify(filePath, dir, prefix, suffix) {
    let fileToObject = filePath.split(processSeparator);
    if (dir) {
        const removalList = dir.split(processSeparator);
        fileToObject = fileToObject.filter((item) => !removalList.includes(item));
    }
    if (prefix) {
        fileToObject.unshift(prefix);
    }
    if (suffix) {
        fileToObject.push(suffix);
    }
    const objectFile = fileToObject.join(posixSeparator);
    return objectFile;
}
(async () => {
    try {
        let index = 0;
        let percent = 0;
        const uploadDir = await (0,_actions_glob__WEBPACK_IMPORTED_MODULE_1__.create)(`${homeDir}`);
        const size = (await uploadDir.glob()).length;
        const localFiles = uploadDir.globGenerator();
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.startGroup)(`${size} objects to refresh`);
        for await (const file of localFiles) {
            const RefreshQuotaRequest = new _alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2__.DescribeRefreshQuotaRequest({});
            const RefreshQuotaResponse = await client.describeRefreshQuota(RefreshQuotaRequest);
            const remainQuota = Number(RefreshQuotaResponse.body.urlRemain) || 0;
            let trailingSlash;
            const extension = (0,path__WEBPACK_IMPORTED_MODULE_4__.extname)(file);
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`ext: ${extension}`);
            if (!extension) {
                trailingSlash = processSeparator;
            }
            else {
                trailingSlash = undefined;
            }
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`trailingSlash: ${trailingSlash}`);
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`file: ${file}`);
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`homeDir: ${homeDir}`);
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`cdnDomain: ${cdnDomain}`);
            const objectName = objectify(file, homeDir, cdnDomain, trailingSlash);
            (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`URL: ${objectName}`);
            if (remainQuota) {
                const refreshRequest = new _alicloud_cdn20180510__WEBPACK_IMPORTED_MODULE_2__.RefreshObjectCachesRequest({
                    objectPath: objectName,
                });
                const refreshResponse = await client.refreshObjectCaches(refreshRequest);
                (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`\u001b[38;2;0;128;0m[${index}/${size}, ${percent.toFixed(2)}%] refreshed: ${objectName} ${refreshResponse.body.refreshTaskId}`);
            }
            else {
                (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)('Daily RefreshUrlQuota exceeded');
                break;
            }
            index += 1;
            percent = (index / size) * 100;
        }
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.endGroup)();
        (0,_actions_core__WEBPACK_IMPORTED_MODULE_0__.info)(`${index} URL refreshed`);
    }
    catch (error) {
        const { setFailed } = await Promise.resolve(/* import() */).then(__nccwpck_require__.t.bind(__nccwpck_require__, 2186, 23));
        setFailed(error.message);
    }
})();
//# sourceMappingURL=main.js.map
})();

module.exports = __webpack_exports__;
/******/ })()
;