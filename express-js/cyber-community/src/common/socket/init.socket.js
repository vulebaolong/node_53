import { Server } from "socket.io";
import { tokenService } from "../../services/token.service.js";
import { prisma } from "../prisma/conntect.prisma.js";

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        /* options */
    });

    io.on("connection", (socket) => {
        // console.log({ socket });
        console.log("socketId", socket.id);

        socket.on("CREATE_ROOM", async (data, cb) => {
            console.log("CREATE_ROOM", data);

            // targetUserIds: là mảng các userId mà chủ nhân đang muốn nhắn tin
            const { targetUserIds = [], accessToken, name } = data;

            // userId: là chủ nhân cuộc gọi socket CREATE_ROOM
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            // gom dữ liệu theo dạng set để unique các userId bên trong
            const userIdSet = new Set([...targetUserIds, userId]);

            // chuyển từ Set => array
            const uniqueUserIds = Array.from(userIdSet);

            console.log("uniqueUserIds", uniqueUserIds);

            if (uniqueUserIds.length === 2) {
                // Xử lý với chatGroup dạng chat 1 - 1 (mục đính chỉ có 1 nhóm chat 1 -1)

                // kiểm tra xem nhóm chat đó đã tồn tại hay chưa
                let chatGroupExits = await prisma.chatGroups.findFirst({
                    where: {
                        ChatGroupMembers: {
                            // some: có ít nhất một phần tử (||)
                            // every: tất cả bản ghi (&&)
                            // none: không có bản ghi nào (!=)
                            every: {
                                userId: {
                                    in: uniqueUserIds,
                                },
                            },
                        },
                    },
                });

                // nếu chưa tồn tại thì tạo mới
                if (!chatGroupExits) {
                    chatGroupExits = await prisma.chatGroups.create({
                        data: {
                            ownerId: userId,
                            ChatGroupMembers: {
                                createMany: {
                                    data: [{ userId: uniqueUserIds[0] }, { userId: uniqueUserIds[1] }],
                                },
                            },
                        },
                    });

                    // cách 2
                    // const chatGroupCreate = await prisma.chatGroups.create({
                    //     data: {
                    //         ownerId: userId,
                    //     },
                    // });

                    // await prisma.chatGroupMembers.createMany({
                    //     createMany: {
                    //         data: [{ userId: uniqueUserIds[0] }, { userId: uniqueUserIds[1] }],
                    //     },
                    // });
                }

                socket.join(`chat${chatGroupExits.id}`);

                cb({
                    status: "success",
                    message: "Create Room thành công",
                    data: { chatGroupId: chatGroupExits.id },
                });
            } else {
                // Xử lý với chatGroup dạng chát nhom (mục đích có thể có nhiều nhóm chat giống nhau)
                const chatGroupExits = await prisma.chatGroups.create({
                    data: {
                        name: name,
                        ownerId: userId,
                        ChatGroupMembers: {
                            createMany: {
                                data: uniqueUserIds.map((userId) => {
                                    return { userId: userId };
                                }),
                            },
                        },
                    },
                });

                socket.join(`chat${chatGroupExits.id}`);

                cb({
                    status: "success",
                    message: "Create Room thành công",
                    data: { chatGroupId: chatGroupExits.id },
                });
            }
        });

        socket.on("JOIN_ROOM", async (data, cb) => {
            console.log("JOIN_ROOM", data);

            const { chatGroupId, accessToken } = data;

            // userId: là chủ nhân cuộc gọi socket JOIN_ROOM
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            socket.join(`chat${chatGroupId}`);

            cb({
                status: "success",
                message: "Create Room thành công",
                data: { chatGroupId: chatGroupId },
            });
        });

        socket.on("SEND_MESSAGE", async (data, cb) => {
            console.log("SEND_MESSAGE", data);

            const { message, accessToken, chatGroupId } = data;

            // userId: là chủ nhân cuộc gọi socket SEND_MESSAGE
            const { userId } = tokenService.verifyAccessToken(accessToken, { ignoreExpiration: true });

            const createdAt = new Date().toISOString();

            // bắn về FE, nếu trước đó mà xử lý lưu db thì sẽ bị chậm
            io.to(`chat${chatGroupId}`).emit("SEND_MESSAGE", {
                messageText: message,
                userIdSender: userId,
                chatGroupId: chatGroupId,
                createdAt: createdAt,
            });

            // sau khi bắn tin nhắn cho FE thì mới xử lý các tác vụ await
            await prisma.chatMessages.create({
                data: {
                    messageText: message,
                    userIdSender: userId,
                    createdAt: createdAt,
                    chatGroupId: chatGroupId,
                },
            });
        });
    });
};
