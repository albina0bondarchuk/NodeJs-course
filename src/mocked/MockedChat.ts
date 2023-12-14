export const MOCKED_CHAT = {
    chatId: '12345',
    participants: [
        {
            userId: 'user1',
            userName: 'Alice',
        },
        {
            userId: 'user2',
            userName: 'Bob',
        },
    ],
    messages: [
        {
            messageId: '1',
            senderId: 'user1',
            text: 'Hello, how are you?',
            timestamp: '2023-09-26T10:00:00',
            readStatus: 'Read',
        },
        {
            messageId: '2',
            senderId: 'user2',
            text: "Hello, Alice! Everything's great, thanks!",
            timestamp: '2023-09-26T10:05:00',
            readStatus: 'Read',
        },
        {
            messageId: '3',
            senderId: 'user1',
            text: "Wonderful! What's new with you?",
            timestamp: '2023-09-26T10:10:00',
            readStatus: 'Unread',
        },
    ],
}
