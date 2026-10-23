import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const db = admin.firestore();
const messaging = admin.messaging();

const extractValidTokens = (docs: FirebaseFirestore.QueryDocumentSnapshot[]): string[] =>
  docs
    .map((d) => String(d.data().token || ''))
    .filter((token) => token.length > 0 && !token.startsWith('sw-local-'));

const dispatchMulticast = async (tokens: string[], title: string, body: string, tag: string) => {
  if (tokens.length === 0) return;
  await messaging.sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: { notification: { icon: '/pwa-192x192.png', tag } },
  });
};

export const sendToAllTokens = async (title: string, body: string, tag: string): Promise<void> => {
  const snapshot = await db.collection('user_tokens').get();
  await dispatchMulticast(extractValidTokens(snapshot.docs), title, body, tag);
};

export const sendToUserByName = async (
  userName: string,
  title: string,
  body: string,
  tag: string
): Promise<void> => {
  const snapshot = await db.collection('user_tokens').where('userName', '==', userName).get();
  await dispatchMulticast(extractValidTokens(snapshot.docs), title, body, tag);
};

export const sendToUsersExcept = async (
  excludedUserName: string,
  title: string,
  body: string,
  tag: string
): Promise<void> => {
  const snapshot = await db.collection('user_tokens').get();
  const docs = snapshot.docs.filter((d) => d.data().userName !== excludedUserName);
  await dispatchMulticast(extractValidTokens(docs), title, body, tag);
};
