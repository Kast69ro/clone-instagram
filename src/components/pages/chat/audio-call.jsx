import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";
import { Phone, Mic, MicOff } from "lucide-react";
import { useChat } from '@/store/pages/chat/pages/default-chat/default-chat';
import { api } from '@/api/pages/chat/utils/axios-reguest';

const socket = io("http://localhost:5000");

const AudioCall = ({id, setId}) => {
  const { getUserByName, userByName } = useChat();

  const [peerId, setPeerId] = useState(() => localStorage.getItem("zvonok") || "");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [call, setCall] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const peerInstance = useRef(null);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    getUserByName(localStorage.getItem('userName'));
  }, []);

  useEffect(() => {
    const peer = new Peer();

    peerInstance.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      localStorage.setItem("zvonok", id);
      socket.emit("peerId", id);
    });

    peer.on("call", async (incomingCall) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        localAudioRef.current.srcObject = stream;
        localAudioRef.current.play();

        incomingCall.answer(stream);

        incomingCall.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play();
        });

        setCall(incomingCall);
        setModalOpen(true);
      } catch (err) {
        console.error("Ошибка при получении аудио", err);
      }
    });

    socket.on("newPeer", (newPeerId) => {
      setId(newPeerId);
    });

    socket.on("removePeer", (removedPeerId) => {
      if (removedPeerId === id) {
        setId("");
        setCall(null);
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        setModalOpen(false);
      }
    });

    return () => {
      peer.destroy();
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    let interval;
    if (modalOpen && call) {
      setCallDuration(0);
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [modalOpen, call]);

  const callUser = async () => {
    if (!id) return alert("Нет ID собеседника");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      localAudioRef.current.srcObject = stream;
      localAudioRef.current.play();

      const outgoingCall = peerInstance.current.call(id, stream);

      outgoingCall.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play();
      });

      setCall(outgoingCall);
      setModalOpen(true);
    } catch (err) {
      console.error("Ошибка при вызове:", err);
    }
  };

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
      setModalOpen(false);

      if (localAudioRef.current) localAudioRef.current.srcObject = null;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    }
  };

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !micOn;
    });
    setMicOn(!micOn);
  };

  return (
    <>
      <div className="flex items-center gap-[10px]">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Введите ID собеседника"
          className="outline-0 border border-gray-300 rounded px-2 py-1"
        />
        <button
          onClick={callUser}
          disabled={!!call}
          className="cursor-pointer"
        >
          <Phone size={26} />
        </button>
      </div>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      {modalOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-90 flex flex-col items-center justify-between p-6 text-white z-50"
          style={{ minHeight: "100vh" }}
        >
          <div className="flex flex-col items-center mt-10">
            <img
              src={api + 'images/' + userByName.avatar}
              alt="User"
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white"
            />
            <h2 className="text-2xl font-semibold">{userByName.fullName}</h2>
            <h2 className="text-xl">{userByName.userName}</h2>
            <h2 className="text-sm text-gray-300 mt-1">
              {String(Math.floor(callDuration / 60)).padStart(2, "0")}:
              {String(callDuration % 60).padStart(2, "0")}
            </h2>
          </div>

          <div className="flex space-x-8 mb-10">
            <button
              onClick={endCall}
              disabled={!call}
              className="bg-red-600 px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-red-700"
            >
              <Phone />
            </button>
            <button
              onClick={toggleMic}
              className="bg-gray-700 px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioCall;
