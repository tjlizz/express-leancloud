
 import LeanCloud from './leanCloud/leanCloud.js'
// 声明 class
new LeanCloud()
const Todo = LeanCloud.baseAV().Object.extend('Todo');

// 构建对象
const todo = new Todo();

// 为属性赋值
todo.set('title', '工程师周会');
todo.set('content', '周二两点，全体成员');

// 将对象保存到云端
todo.save().then((todo) => {
  // 成功保存之后，执行其他逻辑
  console.log(`保存成功。objectId：${todo.id}`);
}, (error) => {
  // 异常处理
});