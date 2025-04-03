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
  name: 'Add',
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
      this.rule.id = crypto.randomUUID();
      Store.add(this.rule).then((res) => {
        this.$Message.success('规则添加成功');
        this.$router.go(-1);
      }).catch((err) => {
        this.$Message.error(err);
      });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.$refs.rule_pattern.focus();
  },
}
</script>

<style scoped>

</style>
