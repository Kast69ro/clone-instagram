'use client'

import { useState, useRef } from 'react'

export default function useVoiceRecorder() {
	const [isRecording, setIsRecording] = useState(false)
	const mediaRecorderRef = useRef(null)
	const audioChunksRef = useRef([])
	const onStopCallbackRef = useRef(null)

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			audioChunksRef.current = []
			mediaRecorderRef.current = new MediaRecorder(stream)

			mediaRecorderRef.current.ondataavailable = e => {
				if (e.data.size > 0) {
					audioChunksRef.current.push(e.data)
				}
			}

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
				if (onStopCallbackRef.current) {
					onStopCallbackRef.current(audioBlob)
				}
			}

			mediaRecorderRef.current.start()
			setIsRecording(true)
		} catch (err) {
			console.error('Ошибка доступа к микрофону:', err)
		}
	}

	const stopRecording = callback => {
		if (!mediaRecorderRef.current) return
		onStopCallbackRef.current = callback
		mediaRecorderRef.current.stop()
		setIsRecording(false)
	}

	return { isRecording, startRecording, stopRecording }
}
