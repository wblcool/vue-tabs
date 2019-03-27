Vue.component("tabs", {
    template: `
        <div class="tabs">
            <div class="tabs-bar">
                <div :class="tabCls(item)"
                     v-for="(item, index) in navList"
                     @click="handleChange(index)">
                     {{ item.label }}
                     <div class="tabs-tab-close" 
                          @click="close(index)"
                          v-if="item.closable">
                            <i class="fa fa-times"></i>
                     </div>
                </div>     
            </div>
            <div class = "tabs-content"> 
                <slot></slot>
            </div>
        </div>`,
    props: {
        value: {
            type: [String, Number]
        }
    },
    data: function(){
        return {
            //用于渲染tabs标题
            navList: [],
            currentValue: this.value
        }
    },
    watch: {
        value: function(val){
            this.currentValue = val;
        },
        currentValue: function(){
            //在当前选中的tab发生变化时,更新pane的显示状态
            this.updateStatus();
        }
    },
    methods: {
        tabCls(item){
            return [
                "tabs-tab",
                {
                    //给当前选中的tab加一个class
                    "tabs-tab-active": item.name === this.currentValue
                }
            ]
        },
        handleChange(index){
            var nav = this.navList[index];
            var name = nav.name;
            //改变当前选中的tab,并触发下面的watch使得内容改变
            this.currentValue = name;
            //更新value
            this.$emit("input", name);
            //触发一个自定义事件,供父级使用
            this.$emit("on-click", name);
        },
        getTabs(){
            console.log("子组件", this.$children);
            //通过遍历子组件,得到所有的pane组件
            return this.$children.filter(function(item){
                //item.$options.name 获取组件中定义的name值
                return item.$options.name === "pane";
            })
        },
        updateNav(){//用于更新获取pane中标签列表
            this.navList = [];
            //设置对this的引用,在function回调里,this指向的并不是vue实例
            var _this = this;
            this.getTabs().forEach(function(pane, index){
                _this.navList.push({
                    label: pane.label,
                    name: pane.name || index,
                    closable: pane.closable
                });
                //如果没有给pane设置name,默认设置它的索引
                if(!pane.name)pane.name = index;
                //设置当前选中的tab索引,后面介绍
                if(index === 0){//如果是第一个标签页,父级并未传入初始值,则默认选中第一个标签页
                    if(!_this.currentValue){
                        _this.currentValue = pane.name || index;
                    }
                }
            });

            this.updateStatus();//标签页列表获取后,未默认选中哪个标签页时页默认选中了第一个,将相应选中的内容显示出来
        },
        updateStatus(){
            var tabs = this.getTabs();
            var _this = this;
            //显示当前选中的tab对应的pane组件,隐藏没有选中的
            tabs.forEach(function(tab){
                return tab.show = tab.name === _this.currentValue;
            })
        },
        close(index){
            this.navList.splice(index, 1);
        }
    }
}) 