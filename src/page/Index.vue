<template>
  <div class="app">
    <div>
      <router-link to="/rule/add">
        <Button type="success">添加规则</Button>
      </router-link>
      <Button type="success" @click="download">
        <i class="ri-upload-2-fill"></i>
        导出
      </Button>

      <input style="display: none;" type="file" ref="upload" accept=".json" @change="upload"/>
      <Button type="success" @click="clickButtonUpload">
        <i class="ri-download-2-line"></i>
        导入
      </Button>
    </div>
    <div style="height: 36px;"></div>
    <div>
      <table>
        <tr>
          <td>优先级</td>
          <td>匹配规则</td>
          <td>代理服务器</td>
          <td>状态</td>
          <td>操作</td>
        </tr>
        <template v-for="(a,b,c) in rule_list">
          <tr>
            <td>{{ a.priority }}</td>
            <td>{{ a.pattern }}</td>
            <td>{{ a.server }}</td>
            <td>
              <template v-if="parseInt(a.state) === 1">
                <Badge status="processing"/>
              </template>
              <template v-else>
                <Badge status="default"/>
              </template>
            </td>
            <td>
              <router-link :to="`/rule/set?id=${a.id}`">
                <Button size="small" type="warning">
                  <i class="ri-edit-box-fill"></i>
                </Button>
              </router-link>
              <Button size="small" @click="del(a.id)" type="error">
                <i class="ri-delete-bin-fill"></i>
              </Button>
            </td>
          </tr>
        </template>
      </table>
    </div>
    <div>
      <Drawer title="Basic Drawer" :closable="false" v-model="value1">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  </div>
</template>

<script>
import Store from "@/tool/store";

export default {
  name: 'Index',
  data() {
    return {
      rule_list: [],
      rule: {
        id: "",
        priority: 1,
        pattern: "",
        server: "",
        state: 0,
      },
    };
  },
  methods: {
    init() {
      Store.getList().then((res) => {
        this.rule_list = res;
      }).catch((err) => {
        this.$Message.error(err);
      });
    },
    del(id) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条规则吗？',
        onOk: () => {
          Store.del(id).then((rule_list) => {
            this.rule_list = rule_list;
            this.$Message.success('规则已删除');
          }).catch((err) => {
            this.$Message.error(err);
          });
        }
      });
    },
    download() {
      chrome.storage.local.get('rule_list', (data) => {
        if (data.rule_list) {
          const jsonData = JSON.stringify(data.rule_list, null, 2);
          const blob = new Blob([jsonData], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'rules.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          this.$Message.success('规则导出成功');
          return;
        }
        this.$Message.error('没有可导出的规则');
      });
    },
    clickButtonUpload() {
      this.$refs.upload.click();
    },
    upload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const rule_list = JSON.parse(e.target.result);
            if (rule_list.length > 0) {
              await Store.reset(rule_list);
              this.$Message.success("导入成功！");
              this.rule_list = rule_list;
            }
          } catch (err) {
            this.$Message.error("导入失败！");
          }
        };
        reader.readAsText(file);
      }
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

table td {
  border: 1px solid #e8eaec;
  height: 36px;
  padding: 0 4px;
}
</style>
