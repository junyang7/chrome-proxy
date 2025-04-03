<template>
  <div>
    <Form :label-width="88">
      <FormItem label="匹配规则">
        <Input ref="rule_pattern" autofocus v-model="rule.pattern" placeholder=".*"></Input>
      </FormItem>
      <FormItem label="代理服务器">
        <Input v-model="rule.server" placeholder="127.0.0.1:7897"></Input>
      </FormItem>
      <FormItem label="状态">
        <RadioGroup v-model="rule.state">
          <Radio :label="1">启用</Radio>
          <Radio :label="0">禁用</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="优先级">
        <InputNumber v-model="rule.priority" placeholder="1"></InputNumber>
      </FormItem>
      <FormItem>
        <Button @click="confirm" type="success">确定</Button>
        <Button @click="cancel" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import Store from "@/tool/store";

export default {
  name: 'Set',
  data() {
    return {
      rule: {
        id: "",
        priority: 1,
        pattern: "",
        server: "",
        state: 1,
      },
    };
  },
  methods: {
    confirm() {
      Store.set(this.rule).then((res) => {
        this.$Message.success('规格修改成功');
        this.$router.go(-1);
      }).catch((err) => {
        this.$Message.error(err);
      });
    },
    cancel() {
      this.$router.go(-1);
    },
    init() {
      Store.get(this.$route.query.id).then((rule) => {
        if (rule) {
          this.rule = rule;
        } else {
          this.$Message.error('未获取到规则');
        }
      }).catch((err) => {
        this.$Message.error(err);
      });
    },
  },
  mounted() {
    this.init();
  },
}
</script>

<style scoped>

</style>
