import { PEER_CONFIG } from "@/config/peer";

class PeerService {
   //@ts-ignore
   peer: RTCPeerConnection;

   constructor() {
      if (typeof window === "undefined") return;
      this.peer = new RTCPeerConnection(PEER_CONFIG);
   }

   async getAnswer(offer: RTCSessionDescriptionInit) {
      if (this.peer) {
         await this.peer.setRemoteDescription(offer);
         const ans = await this.peer.createAnswer();
         await this.peer.setLocalDescription(new RTCSessionDescription(ans));
         return ans;
      }
   }

   async setLocalDescription(ans: RTCSessionDescriptionInit) {
      if (this.peer) {
         await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
      }
   }

   async getOffer() {
      if (this.peer) {
         const offer = await this.peer.createOffer();
         await this.peer.setLocalDescription(new RTCSessionDescription(offer));
         return offer;
      }
   }
}


const peerService = new PeerService();

export default peerService;