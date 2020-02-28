<!--  -->
<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" 
          @titleClick="titleClick" ref="nav" ></detail-nav-bar>
      <scroll class="content"
          :probe-type="3" 
          ref="scroll"  @scroll="contentScroll">
         <detail-swiper :top-images="topImages"></detail-swiper>
         <detail-base-info :goods='goods'></detail-base-info>
         <detail-shop-info :shop='shop'></detail-shop-info>
         <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
         <detail-param-info ref="param"   :param-info="paramInfo"></detail-param-info>
         <detail-comment-info ref="comment"  :comment-info="commentInfo"></detail-comment-info>
         <goods-list ref="recommend" :goods="recommends"></goods-list>
      </scroll>
       <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
       <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>

    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'


import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import {debounce} from "common/utils"
import {BACKTOP_DISTANCE} from "@/common/const"
import {itemListenerMixin,backTopMixin} from "common/mixin"
import { mapActions } from 'vuex';


import {getDetail,getRecommend,Goods,Shop,GoodsParam} from 'network/detail'

    export default {
        name:'Detail',
        props:[''],
        data () {
            return {
              iid:null,
              topImages:[],
              goods:{},
              shop:{},
              detailInfo:{},
              paramInfo: {},
              commentInfo: {},
              recommends: [],
              themeTopYs:[0, 1000, 2000, 3000],
             getThemeTopY: null,
               currentIndex: 0,

            };
        },
        mixins: [itemListenerMixin,backTopMixin],
        created () {
          // 1、保存传入的iid
          this.iid = this.$route.params.iid;
          // 2、根据iid请求数据
          getDetail(this.iid).then(res =>{ 
            console.log(res);
            const data = res.result
            // 1、获取顶部的轮播数据
            this.topImages = data.itemInfo.topImages
            // 2、获取商品信息
            this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
            // 3、创建店铺信息对象
            this.shop = new Shop(data.shopInfo)
            // 4、获取商品的详情数据
            this.detailInfo = data.detailInfo
            // 5、获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
             //6、获取评论信息
            if(data.rate.cRate !== 0){
               this.commentInfo = data.rate.list[0];
              }
          }),
              // 7、请求推荐数据
              getRecommend().then(res =>{
                this.recommends = res.data.list
              })
               
               this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_SAFE_INTEGER);

        //console.log(this.themeTopYs);
      }, 100)

        },
        components: {
         DetailNavBar,
         DetailSwiper,
         DetailBaseInfo,
         DetailShopInfo,
         Scroll,
         DetailGoodsInfo,
         DetailParamInfo,
         DetailCommentInfo,
         DetailBottomBar,
         GoodsList,
      
        },

      methods:{
     ...mapActions(['addCart']),
    detailImageLoad(){
      this.newRefresh();

      this.getThemeTopY();
    },
    titleClick(index){
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position){
      //1.获取y值
      const positionY = -position.y;

      //2.将positionY的值和主题中的值进行对比
      let length = this.themeTopYs.length;
      // for(let i = 0; i < length; i++){
      //   if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >=  this.themeTopYs[i]))){
      //     this.currentIndex = i;
      //     this.$refs.nav.currentIndex = this.currentIndex;
      //   }  
      // }
      for(let i = 0; i < length - 1; i++){
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
          this.listenShowBackTop(position);  
      },
         addToCart(){
      //1.获取购物车所需要的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      //2.将商品添加到购物车内
      //console.log(product);
      //(1)
      //mutation的提交
      //this.$store.commit('addCart', product);
      //action的提交
      //this.$store.dispatch('addCart', product).then({
      //   console.log(res);
      // })

      //(2)
      this.addCart(product).then(res => {
        //console.log(res);
        this.$toast.show(res, 2000);
      })

    },
      }
    }

</script>

<style  scoped>
 #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
    .detail-nav{
    position: relative;
    z-index: 9;
    background: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
</style>