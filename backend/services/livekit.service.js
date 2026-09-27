import { AccessToken } from "livekit-server-sdk";

/**
 * Generates a secure, short-lived LiveKit WebRTC access token.
 * Validates permissions: Host can publish audio/video, viewer can only subscribe.
 */
export const createLiveKitToken = async ({
  roomName,
  participantIdentity,
  participantName,
  isPublisher = false,
}) => {
  const apiKey = process.env.LIVEKIT_API_KEY || "devkey_fittrack";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "secret_fittrack_super_secure_webrtc_key";

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName || "Athlete",
    ttl: "2h",
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isPublisher,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
};
