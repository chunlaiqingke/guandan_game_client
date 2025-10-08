// 定义：事件监听器的类型（任意参数、无返回值的函数）
type Listener = (...args: any[]) => void;

// 定义：增强后的对象需新增的方法（接口）
interface EventMethods {
    on(type: string, method: Listener): void;
    fire(type: string, ...args: any[]): void;
    removeListener(type: string): void; // 修正原代码的拼写错误（removeLister → removeListener）
    removeAllListeners(): void;
}

// 高阶函数：给任意对象注入事件管理能力
function eventLister<T extends object>(obj: T): T & EventMethods {
    // 事件注册表：键是事件类型（string），值是该类型的所有监听器（Listener数组）
    let register: Record<string, Listener[]> = {};

    // 1. 注册事件监听器（on）
    const on: EventMethods['on'] = (type, method) => {
        if (register.hasOwnProperty(type)) {
            register[type].push(method);
        } else {
            register[type] = [method];
        }
    };

    // 2. 触发事件（fire）：传递事件类型 + 额外参数
    const fire: EventMethods['fire'] = (type, ...args) => {
        if (register.hasOwnProperty(type)) {
            const methodList = register[type];
            // 遍历所有监听器，依次执行
            for (let k = 0; k < methodList.length; k++) {
                const handle = methodList[k];
                // 提取fire调用时的额外参数（跳过第一个type参数）
                const eventArgs: any[] = [];
                for (let j = 1; j < arguments.length; j++) {
                    eventArgs.push(arguments[j]);
                }
                // 执行监听器，绑定this为当前对象，传递参数
                handle.apply(this, eventArgs);
            }
        }
    };

    // 3. 移除某事件的所有监听器（removeListener）
    const removeListener: EventMethods['removeListener'] = (type) => {
        register[type] = []; // 清空该事件类型的监听器数组
    };

    // 4. 移除所有事件监听器（removeAllListeners）
    const removeAllListeners: EventMethods['removeAllListeners'] = () => {
        Object.keys(register).forEach((key) => {
            delete register[key]; // 或直接赋值为空对象：register = {}（但会丢失原register的引用？不，闭包变量可修改）
            // 更彻底的方式：register = {}; （因为register是闭包变量，直接重置为空对象）
        });
        // 或简化为：register = {}; （推荐，因为直接重置闭包变量）
        register = {};
    };

    // 将新增方法挂载到原对象上，返回增强后的对象
    return Object.assign(obj, {
        on,
        fire,
        removeListener,
        removeAllListeners,
    });
}

export default eventLister;