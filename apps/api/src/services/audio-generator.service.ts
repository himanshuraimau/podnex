interface AudioSegment {
    buffer: Buffer;
    duration: number; // in seconds
}

interface VoiceConfig {
    hostVoice: string;
    guestVoice: string;
    ttsProvider: string;
}

interface ScriptSegment {
    speaker: "host" | "guest";
    text: string;
}

// Valid Unreal Speech v8 voice IDs
// American Female: Autumn, Melody, Hannah, Emily, Ivy, Kaitlyn, Luna, Willow, Lauren, Sierra
// American Male: Noah, Jasper, Caleb, Ronan, Ethan, Daniel, Zane
const UNREAL_VOICE_MAP: Record<string, string> = {
    // Host voices (female by default)
    default: "Sierra",
    professional: "Hannah",
    casual: "Melody",
    authoritative: "Lauren",
    // Guest voices (male by default)
    energetic: "Noah",
    thoughtful: "Ethan",
    curious: "Jasper",
    // Direct voice name passthrough
    host: "Sierra",
    guest: "Daniel",
    // All valid v8 voices (passthrough)
    Autumn: "Autumn",
    Melody: "Melody",
    Hannah: "Hannah",
    Emily: "Emily",
    Ivy: "Ivy",
    Kaitlyn: "Kaitlyn",
    Luna: "Luna",
    Willow: "Willow",
    Lauren: "Lauren",
    Sierra: "Sierra",
    Noah: "Noah",
    Jasper: "Jasper",
    Caleb: "Caleb",
    Ronan: "Ronan",
    Ethan: "Ethan",
    Daniel: "Daniel",
    Zane: "Zane",
};

export class AudioGeneratorService {
    /**
     * Generate audio for all script segments
     */
    static async generateAll(
        segments: ScriptSegment[],
        voiceConfig: VoiceConfig
    ): Promise<AudioSegment[]> {
        const audioSegments: AudioSegment[] = [];

        for (const segment of segments) {
            const voice =
                segment.speaker === "host"
                    ? voiceConfig.hostVoice
                    : voiceConfig.guestVoice;

            const audio = await this.generateSegment(
                segment.text,
                voice,
                voiceConfig.ttsProvider
            );

            audioSegments.push(audio);
        }

        return audioSegments;
    }

    /**
     * Generate audio for a single segment
     */
    static async generateSegment(
        text: string,
        voice: string,
        provider: string
    ): Promise<AudioSegment> {
        try {
            if (provider === "unreal") {
                return await this.unrealSpeech(text, voice);
            } else if (provider === "elevenlabs") {
                return await this.elevenLabs(text, voice);
            } else {
                throw new Error(`Unsupported TTS provider: ${provider}`);
            }
        } catch (error: any) {
            console.error(`Audio generation failed for segment:`, error);
            throw new Error(`Failed to generate audio: ${error.message}`);
        }
    }

    /**
     * Generate audio using Unreal Speech v8
     */
    private static async unrealSpeech(
        text: string,
        voice: string
    ): Promise<AudioSegment> {
        const apiKey = process.env.UNREAL_SPEECH_API_KEY;

        if (!apiKey) {
            throw new Error("UNREAL_SPEECH_API_KEY not configured");
        }

        // Map voice names to valid Unreal Speech v8 VoiceIds
        const voiceId = UNREAL_VOICE_MAP[voice] || "Sierra";

        const response = await fetch("https://api.v8.unrealspeech.com/stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                Text: text,
                VoiceId: voiceId,
                Bitrate: "192k",
                Speed: 0,    // float, not string
                Pitch: 1.0,  // float, not string
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Unreal Speech API error (${response.status}): ${error}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Estimate duration based on average speaking rate (~150 words/min)
        const wordCount = text.split(/\s+/).length;
        const duration = (wordCount / 150) * 60;

        return {
            buffer,
            duration: Math.round(duration),
        };
    }

    /**
     * Generate audio using ElevenLabs (alternative)
     */
    private static async elevenLabs(
        text: string,
        voice: string
    ): Promise<AudioSegment> {
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            throw new Error("ELEVENLABS_API_KEY not configured");
        }

        // Map voice names to ElevenLabs voice IDs
        const voiceMap: Record<string, string> = {
            default: "21m00Tcm4TlvDq8ikWAM",   // Rachel
            professional: "21m00Tcm4TlvDq8ikWAM",
            casual: "pNInz6obpgDQGcFmaJgB",     // Adam
            authoritative: "21m00Tcm4TlvDq8ikWAM",
            energetic: "AZnzlk1XvdvUeBnXmlld",  // Domi
            thoughtful: "pNInz6obpgDQGcFmaJgB",
            curious: "AZnzlk1XvdvUeBnXmlld",
            host: "21m00Tcm4TlvDq8ikWAM",
            guest: "AZnzlk1XvdvUeBnXmlld",
        };

        const voiceId = voiceMap[voice] || "21m00Tcm4TlvDq8ikWAM";

        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`ElevenLabs API error: ${error}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Estimate duration
        const wordCount = text.split(/\s+/).length;
        const duration = (wordCount / 150) * 60;

        return {
            buffer,
            duration: Math.round(duration),
        };
    }
}
