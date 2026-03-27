import nacl from "@wecrpto/nacl";
import { encodeBase64, decodeBase64, decodeUTF8 } from "@wecrpto/nacl-util";

/**
 * use to generate signature
 * @param {*} privateKey  private key
 * @param {*} publicKey   public key
 * @param {*} message     data that requires encryption
 */
export function generateSignature(privateKey, publicKey, message) {
	const priv = decodeBase64(privateKey);
	const pub = decodeBase64(publicKey);
	const privateKeyBytes = new Uint8Array(64);
	privateKeyBytes.set(priv);
	if (priv.length != 64) privateKeyBytes.set(pub, priv.length);
	const messageBytes = decodeUTF8(message);
	const signature = nacl.sign.detached(messageBytes, privateKeyBytes);
	return encodeBase64(signature);
}