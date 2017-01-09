;(function () {

    var moduleCache = {};
    var includeCache = {
        js: {},
        json: {},
        css: {}
    };

    var baseName = "/JM";

    var config = {
        debug: true,
        version: "1.0.0",
        ready: [],
        tempEngine: true,
        basePaht: "http://" + location.host + baseName + "/",
        public: "http://" + location.host + baseName + "/public/",
        modulePath: "http://" + location.host + baseName + "/modules/",
        depsPath: "http://" + location.host + baseName + "/public/options/deps.json",
        routerState: "http://" + location.host + baseName + "/public/router.json"
    };

    var extend = {};

    var baseClass = constructorHandle(function () {

        this.main = null;

        this.config = {

            name: "",

            version: "1.0.0",

            description: "",

            include: {
                js: [],
                json: [],
                css: []
            },

            jsonObj: {}

        }

        this.callback = null;

        this.container = null;

        this.tempLoad = null;

        this.beforePageLoad = null;

        this.htmlFile = "";

        this.__htmlFilePath = "";

        this.__settingPath = "";

        this.go = function (path) {
            location.hash = "#/" + path;
        }

        this.R = function () {
            return location.hash.substr(2);
        }

        this.ajax = function (options) {

            if (!options) {
                throw "ajax参数必须为一个有效的朴素对象";
            }

            var _this = this;
            var async = options.async === false ? false : true;
            var syncData = null;
            var url = "http://" + location.host + "/cgi-bin/pa/huxiaojiaoshi/" + options.url;

            return $.ajax({
                url: url,
                async: async,
                type: options.type || "post",
                data: options.data || {},
                dataType: options.dataType || "json",
                success: function (data) {
                    data = $.type(data) === "string" ? JSON.parse(data) : data;

                    var msg = "";

                    switch (data.ec) {
                        case 100001:
                            msg = "登录超时";
                            $.ajax.queue = options;
                            break;
                        case 100002:
                            msg = "服务器繁忙";
                            break;
                        case 100003:
                            msg = "请求参数错误";
                            break;
                        case 100004:
                            msg = "密码错误";
                            break;
                        case 100005:
                            msg = "请求数据不存在";
                            break;
                        case 100006:
                            msg = "请求数据已经存在";
                            break;
                        case 100007:
                            msg = "权限不够";
                            break;
                        case 100008:
                            msg = "校验失败,未支付";
                            break;
                        case 100009:
                            msg = "不是公众号粉丝";
                            break;
                        case 100010:
                            msg = "用户可提现余额不足";
                            break;
                        case 100011:
                            msg = "提现处理失败";
                            break;
                        case 100012:
                            msg = "回答已被评价";
                            break;
                        case 100013:
                            msg = "提现申请资格审核失败,提现失败";
                            break;

                        default:
                            options.success && options.success(data);
                            break;
                    }

                    if (data.ec != 0) {

                        if (data.ec === 6666) {
                            return false;
                        }

                        if (options.notAlert) {
                            options.error && options.error();
                            return false;
                        }

                        if (data.ec === 100001) {

                            _this.go("login");

                            //if (!$("#login_box").length) {
                            //    H.PM("login:box", {"title": "登录超时", width: 320, height: 380}, "setting");
                            //} else {
                            //    $("#login_box").window("open");
                            //}

                            return false;
                        }

                        $.messager.alert("警告", "<span style='color:#C40400'>" + msg + "</span>", "", function () {
                            options.error && options.error();
                        });

                    }

                },
                error: function (ex) {
                    console.warn("出错原因:")
                    console.log(ex);
                    $.messager.alert("警告", "<span style='color:#C40400'>请求出错</span>", "", function () {
                        options.error && options.error();
                    });

                }
            })


        }

        this.GUID = function () {
            return "hoosho_" + (Math.random() + Math.random() + "").replace(/\w\./, "");
        }

        this.__modulePath = "";

        this.LM = loadMod;
        this.PM = loadPopMod;

        this.__init = function () {
            var _this = this;
            if (this.__proto__.hasOwnProperty("beforePageStart") && this.beforePageStart) {
                var notInherit = this.beforePageStart.apply(this, arguments);
                if (!notInherit) {
                    return notInherit;
                }
            }

            this.reload = (function () {
                var arg = [].slice.call(arguments, 0);
                return function (bool) {
                    if (bool) {
                        $.each($(".window-body"), function (i, v) {
                            $("#" + v.id).window('close');
                        })
                    }
                    _this.LM.apply(_this, arg[0]);
                }

            })(arguments)

            this.fn = $.extend(true, {}, extend);

            this.alert = $.messager.alert;

            this.prompt = $.messager.prompt;

            this.confirm = $.messager.confirm;

            this.notice = (function () {
                return function (txt, color) {
                    new jBox('Notice', {
                        content: txt,
                        attributes: {
                            x: 'right',
                            y: 'bottom'
                        },
                        animation: 'flip',
                        color: color
                    });
                }
            })();

            this.config.name = arguments[0];

            this.name = arguments[0];

            this.container = arguments[1];

            if (!this.container) {
                throw "容器必须为第二个参数";
            } else if (!this.container.length) {
                //在某种情况下需要先加载某一个东西之后再执行
                //此时的dom对象依然保存着原来的
                this.container = $(this.container.selector);
            }

            this.setting = ($.type(arguments[2]) === "object") ? arguments[2] : {};

            this.settingName = arguments[3] || "";

            this.callback = arguments[4] || $.noop;

            this.htmlFile = (this.__proto__.htmlFile === false && this.__proto__.hasOwnProperty("htmlFile")) ? false : this.__proto__.hasOwnProperty("htmlFile") && this.htmlFile || "main";

            if (arguments[0].split(":").length === 2) {

                this.__modulePath = config.modulePath + arguments[0].split(":")[0] + "/parts/" + arguments[0].split(":")[1] + "/";

                this.__htmlFilePath = this.__modulePath + this.htmlFile + ".html";

                if (this.settingName) {

                    this.__settingPath = this.__modulePath + "setting/" + this.settingName + ".json";

                }

            } else {

                this.__modulePath = config.modulePath + arguments[0] + "/";

                this.__htmlFilePath = this.__modulePath + this.htmlFile + ".html";

                if (this.settingName) {

                    this.__settingPath = this.__modulePath + "setting/" + this.settingName + ".json";

                }

            }

            this.__deps();

        }

        this.__deps = function () {

            var _this = this;

            /**
             * 变态的依赖加载
             * 这样写可能更易于理解
             * **加载后再加载**
             */
            loadSetting.call(this, function () {
                loadDepsCss.call(_this, function () {
                    loadDepsScript.call(_this, function () {
                        loadDepsJson.call(_this, function () {
                            loadPage.call(_this, function () {
                                pageInit.apply(_this, arguments);
                            })
                        })
                    });
                });
            });
        }

        function loadDepsCss(callback) {
            var _this = this;
            var _config = this.config;
            var cssCout = _config.include.css.length;
            var doc = document;
            var head = doc.head;
            var _style;
            var path;
            var name;

            if (_config.include.css && _config.include.css.length) {

                for (var i = 0; i < _config.include.css.length; i++) {
                    cssCout--;
                    (function (z) {
                        name = _config.include.css[z];

                        if (includeCache.css[name]) {
                            console.log("当前文档以及存在此css样式==>" + name);
                            return false;
                        }

                        path = _this.__modulePath + "include/css/" + name + ".css";

                        _style = doc.createElement("link");

                        _style.id = name + "_include_css";

                        _style.type = "text/css";

                        _style.rel = "stylesheet";

                        _style.href = path;

                        head.appendChild(_style);

                        if (cssCout === 0) {
                            callback();
                        }

                    })(i)

                }
                return false;
            }
            callback();
        }

        function loadDepsScript(callback) {
            var _this = this;
            var _config = this.config;
            var jsCount = 0;

            if (_config.include.js && _config.include.js.length > 0) {

                for (var i = _config.include.js.length - 1; i >= 0; i--) {

                    jsCount++;

                    (function (z) {

                        initDepsScript.call(_this, _config.include.js[z], function () {
                            jsCount--;

                            if (jsCount === 0) {
                                //此处执行回调
                                callback();
                            }

                        });

                    })(i);
                }
                return false;
            }
            callback();
        }

        function initDepsScript(name, callback) {
            var _this = this;
            var path = _this.__modulePath + "include/js/" + name + ".js";
            var doc = document;
            var head = doc.head;

            if (includeCache.js[name]) {
                console.info("当前已经加载此依赖项");
                return false;
            }

            //_this.__modulePath + "include/js/" + _config.include.js[z] + ".js"
            var _script = doc.createElement("script");
            _script.id = name;
            _script.type = "text/javascript";
            _script.async = "async";
            _script.charset = "UTF-8";
            _script.src = path;
            _script.onload = function () {
                console.log(name + "加载成功");
                includeCache.js[name] = true;
                $(_script).remove();
                callback();
            };
            _script.onerror = function () {
                throw name + ".js加载失败";
            }

            head.appendChild(_script);
        }

        function loadDepsJson(callback) {

            var _this = this;
            var _config = this.config;

            var jsonCount = 0;

            if (_config.include.json && _config.include.json.length > 0) {

                jsonCount++;

                for (var x = _config.include.json.length - 1; x >= 0; x--) {

                    (function (z) {
                        var path = _this.__modulePath + "include/json/" + _config.include.json[x] + ".json";
                        $.getJSON(path, function (data, status) {
                            if (status === "success") {
                                jsonCount--;

                                _config.hasOwnProperty("jsonObj") ? (_config.jsonObj[_config.include.json[z]] = data) : "";

                                if (jsonCount === 0) {
                                    //执行回调
                                    callback();
                                }
                            } else {
                                throw _config.include.json[z] + ".json加载失败"
                            }
                        })

                    })(x)

                }
                return false;
            }
            callback();
        }

        function loadSetting(callback) {
            var _this = this;
            if (this.settingName) {
                $.getJSON(this.__settingPath, {}, function (data) {
                    $.extend(true, _this.setting, data);
                    callback();
                });
                return false;
            }
            callback();
        }

        function loadPage(callback) {
            var _this = this;

            if (_this.htmlFile === false) {
                callback();
                return false;
            }
            $.ajax({
                url: this.__htmlFilePath,
                dataType: "html",
                type: "get",
                success: function (data) {
                    callback(data);
                },
                error: function () {
                    throw _this.htmlFile + "页面加载出错";
                }
            })
        }

        function pageInit() {
            var _this = this;
            var thisProto = this.__proto__;
            this.self = _this.container;

            if ($.type(_this.beforePageLoad) === "function" && thisProto.hasOwnProperty("beforePageLoad")) {
                _this.beforePageLoad.call(_this);
            }

            if ($.type(_this.main) !== "function" || !thisProto.hasOwnProperty("main")) {
                throw "找不到main入口";
            }

            var template = arguments[0];
            var tempHandler;
            var tempData;

            if (arguments.length && config.tempEngine) {

                /**
                 * 使用的Handlebars 模板引擎
                 */
                tempHandler = Handlebars.compile(template);

                thisProto.hasOwnProperty("tempLoad") && $.type(thisProto.tempLoad) === "function" && thisProto.tempLoad.call(this, tempData = {});

                template = tempHandler(tempData);

            }
            if (_this.container.length) {

                _this.container.html(template);

                $.each(_this.container.find('[ueditor]'), function (index, val) {
                    /* iterate through array or object */
                    var uid = _this.GUID();

                    var vid = val.id || (val.id = uid);

                    var height = val.dataset.height || 300;

                    var width = val.dataset.width || "100%";

                    var zIndex = val.dataset.zIndex || 0;

                    //home_url由于框架内部把script，remove了，
                    //而UEDITOR内部通过script的最后一个标签查找的home_url
                    //这里需要制定home_url

                    _this.ue = UE.getEditor(vid, $.extend(true, {
                        UEDITOR_HOME_URL: config.basePaht + "extends/UEditor/",
                        toolbars: [
                            ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|', /* 'customstyle', 'paragraph', 'fontfamily',*/ 'fontsize', '|', 'directionalityltr', 'directionalityrtl', 'indent', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|', 'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'attachment', 'map', 'pagebreak', 'template', 'background', '|', 'horizontal', 'spechars', '|', 'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|', 'searchreplace', 'help']
                        ],
                        initialFrameWidth: width,
                        imagePopup: false,
                        initialFrameHeight: height,
                        serverUrl: "/cgi-bin/ue/cgi_ue_resource_upload",
                        zIndex: 0
                    }, val.dataset));

                });


            } else {
                throw "找不到元素===>" + _this.container.selector;
            }


            _this.main.call(this);

            this.hasOwnProperty("callback") && $.type(_this.callback) === "function" && _this.callback.call(this);
        }

    });


    function loadMod(name, node, set, setOpt, fn) {
        node.html("");
        runMod(name, function (constructor, name) {
            new constructor(name, node, set, setOpt, fn);
        })

    }

    function loadPopMod(name, setOpt, set, fn) {

        var master = "";

        if (name.match(/@/g)) {

            master = "_" + name.split("@")[1];
            name = name.split("@")[0];
        }

        if (name.match(/:/g)) {
            $name = name.split(":").join("_") + master;
        } else {
            $name = name + master;
        }

        var doc = document;
        var body = doc.body;
        var $id = $("#" + $name);
        var node;

        if (!$id.length) {

            node = doc.createElement("div");

            node.id = $name;

            node.style.dispaly = "none";

            node.dataset.options = "modal:true,closed:true,iconCls:'icon-save'";

            body.appendChild(node);

        }

        loadMod(name, $("#" + $name), setOpt, set, function () {

            $("#" + $name).window({
                title: setOpt.title || "窗口",
                width: setOpt.width || 600,
                height: setOpt.height || 400,
                closable: (setOpt.closable === false) ? false : true,
                closed: false,
                resizable: false,
                maximizable: false,
                minimizable: false,
                modal: true
            });

            fn && fn();
        });

    }

    function runMod(name, callback) {
        if (!name && $.type(name) !== "string") {
            throw "请检测模块名称";
        }

        var mod = moduleCache[name];
        if (!mod) {
            var nameGroup = name.split(":");
            var notCache = config.debug ? "?v=" + $.now() : "";
            var path;
            if (nameGroup.length === 2) {
                path = config.modulePath + nameGroup[0] + "/parts/" + nameGroup[1] + "/" + nameGroup[1] + ".class.js" + notCache;
            } else {
                path = config.modulePath + nameGroup[0] + "/" + nameGroup[0] + ".class.js" + notCache;
            }
            require(path, function () {

                $("head > script").remove();
                if (!moduleCache[name]) {
                    throw "请检测控制器内的模块名称";
                }
                runMod(name, function (classHandler) {
                    callback(classHandler, name);
                });

            })
            return;
        }
        // debugger
        if (mod.inherit) {
            runMod(mod.inherit, function (classHandler) {
                callback(constructorHandle(mod.classHandler, classHandler), name);
            });
            return;
        }
        // debugger
        callback(mod.classHandler, name)
    }

    function constructorHandle(C1, C2) {

        var Constructor = function () {
            // debugger
            if ($.type(this.__init) !== "function") {
                throw "必须继承baseClass或者其子类";
            }

            this.__init.apply(this, arguments);

        }

        // debugger

        if (C2) {

            var tmp = function () {
            };

            tmp.prototype = C2.prototype;

            Constructor.prototype = new tmp();

            Constructor.prototype.constructor = baseClass;

            tmp = null;

        }

        var c1Obj = new C1();

        for (var k in c1Obj) {

            Constructor.prototype[k] = c1Obj[k];

        }

        return Constructor;

    }

    function cacheModule(name, option) {

        moduleCache[name] = {

            classHandler: option.classHandler,
            inherit: option.inherit

        }

        return moduleCache[name];

    }

    cacheModule("baseClass", {
        inherit: "",
        classHandler: baseClass
    });


    var H = function (name, option) {

        cacheModule(name, option);

    }

    H.LM = H.loadModule = loadMod;
    H.PM = H.loadPopModule = loadPopMod;

    H.config = config;

    H.ready = config.ready;

    H.extend = extend;

    H.loadState = 0;

    H.baseName = baseName;

    window.H = H;
})();
;(function () {

    //有毒的require模块加载器
    //

    var moduleCache = {};
    var dataMain;
    var jsReg = /^http:\/\/([\w]+)\.js$/;

    var require = function (deps, callback) {

        var isEmpty = false;
        var depsCount = 0;
        var params = [];
        var i;
        var iLen;
        var moName;
        var id;
        moName = document.currentScript && document.currentScript.id;
        if (deps) {
            if ($.type(deps) === "array") {
                if (deps.length === 0) {
                    setTimeout(function () {
                        actionModule(moName, [], callback);
                    }, 0);
                } else if (deps.length === 1) {
                    id = deps[0];
                } else {
                    for (i = 0, iLen = deps.length; i < iLen; i++) {
                        (function (z) {
                            depsCount++;
                            loadModule(deps[i], function (param) {
                                params[i] = param;
                                depsCount--;
                                if (depsCount === 0) {
                                    actionModule(moName, params, callback);
                                }
                            });
                        })(i)
                    }
                    return false;
                }
            } else if ($.type(deps) === "string") {
                id = deps;
            }
            loadModule(id, callback);
        } else {
            setTimeout(function () {
                actionModule(moName, [], callback);
            }, 0);
        }
    }


    var _getPath = function (moName) {
        var path = "";
        var config = require.config;

        if (jsReg.test(moName)) {
            return moName;
        }

        if (config) {
            if (config.baseUrl) {
                path = config.baseUrl;
            }
            if (config.paths.moName) {
                path += config.paths.moName;
            }
        }
        if (moName.indexOf(".js") === -1) {
            path += moName + ".js"
        } else {
            path += moName;
        }
        return path;
    }

    function loadModule(moName, callback) {

        var url = _getPath(moName);
        var mo;
        var _script;
        var head;

        //如果已经加载过了

        if (moduleCache[moName]) {

            mo = moduleCache[moName];

            if (mo.status == "loaded") {
                //已经执行过了，不再执行
            } else {
                mo.onload.push(callback);
            }
            return;
        }

        mo = moduleCache[moName] = {
            moName: moName,
            src: url,
            onload: [callback],
            params: [],
            exp: null
        }

        //jquery的append在这里有一个坑

        _script = document.createElement('script');
        _script.id = moName;
        _script.type = 'text/javascript';
        _script.charset = 'utf-8';
        _script.async = true;
        _script.src = url;

        head = document.getElementsByTagName("head")[0];

        head.appendChild(_script);
    }

    function actionModule(moName, params, callback) {
        var mo;
        var fn;
        // debugger
        if (moduleCache[moName]) {

            mo = moduleCache[moName];

            mo.status = "loaded";

            mo.params = params;

            mo.exp = callback && callback(params) || null;

            while (fn = mo.onload.shift()) {
                fn(mo.exp);
            }
        } else {
            callback && callback.apply(this, params);
        }
    }

    window.require = window.define = require;

    dataMain = document.currentScript.getAttribute("data-main");
    if (dataMain) {
        require(dataMain)
    }

})();
;(function () {
    H.ready.push(function () {
        $.getJSON(H.config.public + "options/router.json", function (data) {

            if (!data || $.isEmptyObject(data) || data.length === 0) {
                return false;
            }
            encapsulationRouter(data);
        });

        function encapsulationRouter(data) {

            var routerObj = {};
            var routerList = data.routerList;
            var indexPage = data.indexPath;

            function abc() {
                console.log(678)
            }

            for (var i = 0; i < routerList.length; i++) {
                routerList[i].afterPageClose = null;
                routerObj[routerList[i].path] = {
                    on: (function (biData) {
                        return function () {
                            if (H.router) {
                                H.router(function () {
                                    H.LM(biData.module, biData.view && $(biData.view) || $("body"), biData.settingObj, biData.settingFile, function () {
                                        if (H.config.debug) console.log("[" + biData.module + "加载成功]");
                                    })
                                });
                            } else {
                                H.LM(biData.module, biData.view && $(biData.view) || $("body"), biData.settingObj, biData.settingFile, function () {
                                    if (H.config.debug) console.log("[" + biData.module + "加载成功]");
                                })
                            }
                        }
                    })(routerList[i]),
                    after: (function (biData) {
                        return function () {
                            if ($.type(biData.after) === "function") {
                                biData.afterPageClose();
                            }
                        }
                    })(routerList[i])
                };
            }
            var router = new Router(routerObj).configure({
                recurse: "backward"
            }).init(indexPage);
        }
    })
})()
;
(function () {
    var depsDirPath = "http://" + location.host + H.baseName + "/extends/";
    var http = /^http:\/\//;
    var jsFilePostFix = /\.js$/;
    var cssFilePostFix = /\.css$/;
    var doc = document;
    var depsCount = 0;
    var count = 0;
    var zzz = 1;
    var percentage = "";
    //获取到配置文件
    $.getJSON(H.config.depsPath, function (data) {
        getDepsCount(data);
        forEachDeps(data, function () {
            depsCount--;
            percentage = parseInt(zzz++ / count * 100) + "%";
            $(".maskLoad").find(".progress-bar").css("width",percentage).text(percentage);
            if (depsCount === 0) {
                for (var i = 0; i < H.ready.length; i++) {
                    H.ready[i]();
                }
                $(".maskLoad").fadeOut(800, function () {
                    $(this).addClass('hide');
                });
            }
        });
    });

    //遍历配置项
    function forEachDeps(data, callback) {
        var $mask = $(".maskLoad");
        var fileGroup;
        var current;
        var i;
        var jsFiles;
        var jsGroup;
        var cssFiles;
        var cssGroup;
        var iLen;
        if ($mask.length === 0) {
            $("body").append("<div class='maskLoad'><div class='load-main'>" +
                "<span class='load-gif'>&nbsp;</span>" +
                "<div class='progress'>" +
                "<div class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='min-width: 2em;'>" +
                "0%" +
                "</div>" +
                "</div></div></div>");
            $mask = $(".maskLoad");
        }
        $mask.removeClass('hide');
        if (data.baseUrl) {
            if (http.test(data.baseUrl)) {
                depsDirPath = data.baseUrl;
            } else {
                depsDirPath += data.baseUrl;
            }
        }
        for (var i = 0, iLen = data.defaultRunDeps.length; i < iLen; i++) {
            current = data.defaultRunDeps[i];
            if (!data.depsList[current]) {
                throw H.config.depsPath + " 配置文件配置出错"
            }
            (function (current) {
                if ($.type(data.depsList[current]) === "string") {
                    if (data.depsList[current].split("+") > 1) {
                        fileGroup = data.depsList[current].split("+");
                        for (var z = 0; z < fileGroup.length; z++) {
                            depsCount++;
                            ;
                            (function (z) {
                                loadDeps(fileGroup[z], false, function () {
                                    callback(depsCount);
                                }, current + "_" + z);
                            })(z)
                        }
                    } else {
                        depsCount++;
                        loadDeps(data.depsList[current], true, function () {
                            callback(depsCount);
                        }, current)
                    }
                } else {
                    jsFiles = data.depsList[current].js;
                    cssFiles = data.depsList[current].css;
                    if (jsFiles.split("+").length > 1) {
                        jsGroup = jsFiles.split("+");
                        for (var x = 0; x < jsGroup.length; x++) {
                            depsCount++;
                            ;
                            (function (x) {
                                loadDeps(jsGroup[x], true, function () {
                                    callback(depsCount);
                                }, current + "_" + x);
                            })(x)
                        }
                    } else {
                        depsCount++;
                        loadDeps(jsFiles, true, function () {
                            callback(depsCount);
                        }, current);
                    }
                    if (cssFiles.split("+").length > 1) {
                        cssGroup = cssFiles.split("+");
                        for (var y = 0; y < cssGroup.length; y++) {
                            depsCount++;
                            // cssGroup[y]
                            ;
                            (function (y) {
                                loadDeps(cssGroup[y], "", function () {
                                    callback(depsCount);
                                }, current + "_" + y);
                            })(y)
                        }
                    } else {
                        depsCount++;
                        loadDeps(cssFiles, "", function () {
                            callback(depsCount);
                        }, current)
                    }
                }
            })(current);
        }
    }

    //获取依赖总数
    function getDepsCount(data) {
        var depsArr = data.defaultRunDeps;
        var deps = data.depsList;
        var i = 0, ilen = depsArr.length;
        var curDepsName = "";
        var curDeps = null;

        for (i = 0; i < ilen; i++) {
            curDepsName = depsArr[i];
            curDeps = deps[curDepsName];
            if ($.type(curDeps) === "string") {
                count++;
            } else {
                $.each(curDeps, function (i, o) {
                    count += (o.split("+").length === 1) ? 1 : o.split("+").length;
                })
            }
        }
    }

    //加载配置
    function loadDeps(file, async, callback, fileName) {
        if (cssFilePostFix.test(file)) {
            var filePath;
            if (http.test(file)) {
                filePath = file;
            } else {
                filePath = depsDirPath + fileName.split("_")[0] + "/" + file;
            }
            if (H.config.debug) {
                $(".maskLoad").append("<i>加载中:" + filePath + "...</i>");
            }
            var _linkCss = doc.createElement("link");
            _linkCss.rel = 'stylesheet';
            _linkCss.id = fileName + "_css";
            _linkCss.href = filePath;
            doc.head.appendChild(_linkCss);
            callback();
            if (H.config.debug) {
                setTimeout(function () {
                    for (var i = 0; i < $(".maskLoad i").length; i++) {

                        if ($(".maskLoad i").eq(i).text().indexOf(filePath) != -1) {
                            $(".maskLoad i").eq(i).addClass("depsLoaded").html($(".maskLoad i").eq(i).text().replace(/加载中/g, "加载成功"));
                        }

                    }

                }, 50);
            }
        } else {
            var _script = doc.createElement("script");
            var id = fileName + "_js";
            var filePath;
            if (http.test(file)) {
                filePath = file;
            } else {
                filePath = depsDirPath + fileName.split("_")[0] + "/" + file;
            }
            if (H.config.debug) {
                $(".maskLoad").append("<i>加载中:" + ((file.indexOf(".js") === -1) ? filePath + ".js" : filePath) + "...</i>");
            }
            _script.id = id;
            _script.type = "text/javascript";
            _script.async = async;
            _script.src = (file.indexOf(".js") === -1) ? filePath + ".js" : filePath;
            _script.onload = function () {
                $(_script).remove();
                callback();
                if (H.config.debug) {
                    setTimeout(function () {
                        for (var i = 0; i < $(".maskLoad i").length; i++) {

                            if ($(".maskLoad i").eq(i).text().indexOf(filePath) != -1) {
                                $(".maskLoad i").eq(i).addClass("depsLoaded").html($(".maskLoad i").eq(i).text().replace(/加载中/g, "加载成功"));
                            }

                        }

                    }, 50)
                }
            };
            doc.head.appendChild(_script);
        }
    }
})();
