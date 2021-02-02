// import main from '../main'

// export default {
//     getCategories: (queryInfo) => {
//         var response_data = {
//             goods_cate: [],
//             goods_list_total: {},
//             status: true
//         }
//         const { data: res } = this.$http.get('categories', { params: queryInfo }).then(res => {
//             response_data.goods_cate = res.data.data.result,
//             response_data.goods_list_total = res.data.data.total,
//             response_data.status = true
//             return response_data
//         }).catch(err => {
//             response_data.status = false
//             return response_data
//         })
//         // return response_data
//     }
// }

// module.exports.getCategories = async (queryInfo) => {
//     const { data: res } = await main.$http.get('categories', { params: queryInfo })
//     const response_data = {
//         goods_cate: [],
//         goods_list_total: {}
//     }
//     if (res.meta.status === 200) {
//         response_data.goods_cate = res.data.result
//         response_data.goods_list_total = res.data.total
//         return response_data
//     } else {
//         return 'Faild get categories and query'
//     }
// }