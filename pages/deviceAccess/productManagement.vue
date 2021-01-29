<template>
  <div class="product-management">
    <a-row class="page-title-row">
      <a-col :span="24">
        <h4 class="page-title">产品管理</h4>
      </a-col>
    </a-row>
    <div class="main-content">
      <a-row class="block-normal block-white">
        <a-col :span="16">
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-select default-value="all" class="regular-input">
            <a-select-option value="all">
              全部
            </a-select-option>
          </a-select>
          <a-input placeholder="请输入产品名称搜索" class="regular-input" />
        </a-col>
        <a-col :span="8" class="text-right">
          <a-button type="primary">查询</a-button>
          <a-button>重置</a-button>
        </a-col>
      </a-row>
      <a-row class="block-normal block-white">
        <a-col :span="24">
          <a-row class="block-control-row">
            <a-col :span="8">
              <h5 class="block-title">
                产品列表
              </h5>
            </a-col>
            <a-col class="text-right" :span="16">
              <a-button>批量删除</a-button>
              <a-button type="primary">添加产品</a-button>
            </a-col>
          </a-row>
          <a-row class="block-content-row">
            <a-col :span="24">
              <a-table :columns="config.productListTable" :data-source="remoteData.productList" bordered :row-selection="contentControl.productListSelection" />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { productListTable } from '@/assets/tables'

export default {
  data() {
    return {
      config: {
        productListTable,
      },
      remoteData: {
        productList: [
        ],
      },
      contentControl: {
        productListSelection: {},
      },
    }
  },
}
</script>
