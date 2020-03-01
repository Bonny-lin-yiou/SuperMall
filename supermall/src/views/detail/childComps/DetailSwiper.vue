<!--  -->
<template>
    <swiper>
       <swiper-item v-for="item in topImages" class="detail-item">
          <img :src="item" alt="">
        </swiper-item>
    </swiper>
  
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

    export default {
        name:'DetailSwiper',
        props:{
          topImages:{
            type:Array,
            default(){
              return []
            }
          }
        },
        data () {
            return {

            };
        },
        components: {
          Swiper,
          SwiperItem
        },
        computed: {},
        beforeMount() {},
        mounted() {},
        methods: {},
        watch: {}

    }

</script>

<style  scoped>

.detail-item{
  height: 300px;
  overflow: hidden;
}
</style>