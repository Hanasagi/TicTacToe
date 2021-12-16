import { createStore } from 'vuex'

export default createStore({
  state: {
    matchId:"0",
    "boardState": ["-", "-", "-", "-", "-", "-", "-", "-", "-"],
    "lastMove": {
      "char": "", // char one of ['o','x'], required
      "position": 0 // number from 0 to 8, required 
    },
  },
  mutations: {
    updateMatchId(state, payload){
      state.matchId=payload;
    },
    updateBoardState(state,payload){
      state.boardState[payload[0]]=payload[1];
    },
    resetBoardState(state,payload){
      state.boardState=payload;
    },
    updateLastMove(state,payload){
      state.lastMove["char"]=payload[0];
      state.lastMove["position"]=payload[1];
    },
    resetLastMove(state,payload){
      state.lastMove=payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
