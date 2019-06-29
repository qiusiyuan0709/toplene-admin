<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header"
           class="clearfix">
        <span>筛选条件</span>
      </div>

      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="特殊资源">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region"
                     placeholder="请选择活动区域">
            <el-option label="区域一"
                       value="shanghai"></el-option>
            <el-option label="区域二"
                       value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动形式">
          <el-date-picker v-model="form.value1"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表区域 -->
    <el-card class="list-card">
      <div slot="header"
           class="clearfix">
        <span>共找到15条符合条件的内容</span>
      </div>

      <!-- table 表格 -->
      <el-table class="list-table"
                :data="articles"
                style="width: 100%"
                v-loading="articleLoading">
        <el-table-column prop="cover.images[0]"
                         label="封面"
                         width="60">
          <!-- 表格列默认只能输出文本，如果需要自定义里面的内容，则需要 -->
          <!--
            slot-scope 是插槽作用域，现在先听个名词，你要知道的是值 scope 是起的一个名字
            scope 中有个成员叫 row
            也就是说 scope.row 就是当前的遍历项对象
            自定义列模板，el-table-column 的 prop 就没有意义了
          -->
          <template slot-scope="scope">
            <img width="30"
                 :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>

        <el-table-column prop="title"
                         label="标题"
                         width="180">
        </el-table-column>

        <el-table-column prop="pubdate"
                         label="发布日期"
                         width="180">
        </el-table-column>

        <el-table-column label="状态"
                         width="180">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
          <el-tag type="success">标签一</el-tag>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success"
                       plain>修改</el-button>
            <el-button type="danger"
                       plain
                       @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- table 表格 -->

      <!-- 数据分页 -->
      <!--
        一：分多少页
          每页多大，默认是10条每页，我们的接口如果没有指定每页条数，则默认也是按照每页10条返回数据
          有多少条数据
        二：页面改变加载对应的页码数据
       -->
      <el-pagination background
                     layout="prev, pager, next"
                     :total="totalCount"
                     :disabled="articleLoading"
                     @current-change="handleCurrentChange">
      </el-pagination>
      <!-- 数据分页 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [], // 列表数据
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      totalCount: 0,
      articleLoading: false,
      page: 1,
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'seccess',
          label: '审核通过'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ]
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    loadArticles (page = 1) {
      this.articleLoading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page, // 请求数据的页码，不传默认为 1
          per_page: 10 // 请求数据的每页大小，不传默认为10
        }
      }).then(data => {
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        this.articleLoading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },

    handleCurrentChange (page) {
      // 当页码发生改变的时候，请求该页码对应的数据
      this.loadArticles(page)
    },

    handleDelete (article) {
      this.$confirm('确认删除嘛？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确定执行
        // 发送删除请求
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          // 重新加载数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 30px;
}
</style>
