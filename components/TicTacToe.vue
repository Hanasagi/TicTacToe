<template>
  <div id="game">
    <h1>Tic Tac Toe</h1>
    <div class="board">
      <div class="board-frame" :id="index-1" v-for="index in 9" :key="index" @click="playMove">

      </div>
    </div>
    <svg ref="circle" class="placeholder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z"/>      
    </svg>
    <svg ref="cross" class="placeholder" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'TicTacToe',
  data(){
    return{
      side:"",
      element:""
    }
  },
  mounted(){
    this.side=this.$refs.circle;
    this.element="o"
    this.$store.commit('updateMatchId', Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  },
  methods:{
    playMove(e){
      let svg=this.side.cloneNode();
      let path=this.side.children[0].cloneNode()
      svg.style.display="block";
      svg.append(path);
      this.$store.commit("updateBoardState",[e.target.id,this.element])
      this.$store.commit("updateLastMove",[this.element,e.target.id])
      e.target.append(svg);
    }
  }
}
</script>

<style scoped lang="scss">
  $background:#1B2021;
  $border:#ED6A5A;
  $border-width:10px;
  $text-main:#F4F1BB;
  $text-second:#9BC1BC;
  #game{
    background:$background;
    height:100vh;
    width:100vw;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
  }
  h1{
    font-size:3em;
    text-align:center;
    margin:0;
    text-transform:uppercase;
    font-weight:lighter;
    color:$text-main;
  }
  .board{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    margin:auto;
    width:50em;
    height:50em;
    & > .board-frame{
      background:$background;
      width:auto;
      height:auto;
      position:relative;
      display:flex;
      justify-content:center;
      align-items:center;
    }
  }
  .board-frame:nth-child(4){
    border-top:$border-width solid;
    border-bottom:$border-width solid;
    border-color:$border;
  }
  .board-frame:nth-child(5){
    border:$border-width solid;
    border-color:$border;
  }
  .board-frame:nth-child(6){
    border-top:$border-width solid;
    border-bottom:$border-width solid;
    border-color:$border;
  }
  .board-frame:nth-child(2){
    border-left:$border-width solid;
    border-right:$border-width solid;
    border-color:$border;
  }
  .board-frame:nth-child(8){
    border-left:$border-width solid;
    border-right:$border-width solid;
    border-color:$border;
  }
  .placeholder{
    width:10em;
    height:10em;
    fill:$text-second;
    display:none;
  }
</style>
