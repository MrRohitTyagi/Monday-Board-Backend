import notificationModel from "../models/notification-model.js";
import pulseModel from "../models/pulse-model.js";

async function generateNotification(notificationPayload) {
  try {
    const { chat, user: admin, type, data, updatedPulse } = notificationPayload;

    // await mongoose.connect(process.env.MONGO_URL);

    const pulse = updatedPulse || (await pulseModel.findById(data.pulseId));

    const notificationPromises = [];
    for (const user of pulse.assigned) {
      const promise = createNotification({
        chat: chat,
        user: user,
        type: type,
        data: data,
        createdBy: admin._id,
        pulse: pulse,
      });
      notificationPromises.push(promise);
    }

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}
async function createNotification(data) {
  const body = createPyloadBytype(data);
  const notification = await notificationModel.create(body);
  console.log("notification", notification);
}

function createPyloadBytype({ chat, user, type, data, createdBy, pulse }) {
  let payload = {
    createdBy: createdBy,
    attachedUser: user,
    notificationType: type,
    attachedPulse: data.pulseId,
    redirect_url: `/board/${data.boardId}/pulse/${data.pulseId}`,
  };

  switch (type) {
    case "ASSIGNED_TO":
      payload.prefix_text = `assigned you`;
      payload.postfix_text = `to the item "${pulse.title}"`;
      payload.content = "";
      break;
    case "NEW_UPDATE": {
      payload.prefix_text = `wrote an update`;
      payload.postfix_text = `on the item you are assigned to`;
      payload.content = chat.content;
      break;
    }
    case "NEW_REPLY": {
      payload.prefix_text = `replied`;
      payload.postfix_text = `to your update`;
      payload.content = chat.content;
      break;
    }
    default:
      break;
  }

  return payload;
}

export { generateNotification };
