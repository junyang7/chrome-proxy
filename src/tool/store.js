export default class Store {

    static async add(rule) {
        return this.getList()
            .then((rule_list) => {
                rule_list.push(rule);
                rule_list.sort((a, b) => a.priority - b.priority);
                return this.reset(rule_list);
            });
    }

    static async del(id) {
        return this.getList()
            .then((rule_list) => {
                const index = rule_list.findIndex(_rule => _rule.id === id);
                if (index !== -1) {
                    rule_list.splice(index, 1);
                }
                return this.reset(rule_list);
            });
    }

    static async set(rule) {
        return this.getList()
            .then((rule_list) => {
                const index = rule_list.findIndex(_rule => _rule.id === rule.id);
                if (index !== -1) {
                    rule_list[index] = rule;
                } else {
                    rule_list.push(rule);
                }
                return this.reset(rule_list);
            });
    }

    static async getList() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('rule_list', (data) => {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError.message));
                }
                resolve(data.rule_list || []);
            });
        });
    }

    static async get(id) {
        return this.getList()
            .then((rule_list) => {
                return rule_list.find(_rule => _rule.id === id);
            })
    }

    static async reset(rule_list) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({rule_list}, () => {
                if (chrome.runtime.lastError) {
                    return reject(new Error(chrome.runtime.lastError.message));
                }
                chrome.runtime.sendMessage({action: 'reset'}, (response) => {
                    if (chrome.runtime.lastError) {
                        return reject(new Error(chrome.runtime.lastError.message));
                    }
                    resolve(rule_list);
                });
            });
        });
    }

}
