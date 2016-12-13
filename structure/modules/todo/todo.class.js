define("", function() {
    //模块名称
    //必须与文件名一致
    H("todo", {
        //继承的模块
        inherit: "baseClass",
        //真正的控制器
        classHandler: function() {
            //配置
            this.config = {
                    name: "todo",
                    version: "1.0.0",
                    include: {
                        js: ["todo"],
                        json: ["todo"],
                        css: ["todo"]
                    },
                    jsonObj: {}
                }
                //是否加载main.html
            this.htmlFile = "main";
            //加载main.html
            //模板数据收集
            this.tempLoad = function(scope) {
                    scope.name = "todo"
                }
                //模块加载前            
            this.beforePageLoad = function() {
                    console.log(this)
                }
                //入口
            this.main = function() {

            }
        }
    })
})