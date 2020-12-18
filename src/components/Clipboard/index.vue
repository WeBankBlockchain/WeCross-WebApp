<template>
  <div>
    <el-button icon="el-icon-document-copy" plain style="padding: 0px 0px 0px" @click="handleCopy(inputData, $event)" />
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

export default {
  name: 'Clipboard',
  props: {
    inputData: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  methods: {
    handleCopy(text, event) {
      clipboard(text, event)
    }
  }
}
</script>
