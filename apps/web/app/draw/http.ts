import axios from "axios";

// Create a token provider that will be initialized on the client side
const authTokenProvider = {
    token: null as string | null,
    setToken: function (newToken: string) {
        this.token = newToken;
    },
    getToken: function () {
        // If we're in the browser and don't have a token yet, try to get it from localStorage
        if (typeof window !== 'undefined' && !this.token) {
            this.token = localStorage.getItem("authToken");
        }
        return this.token;
    }
};

// This function can be called from client components to initialize the token
export const initAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem("authToken");
        if (token) {
            authTokenProvider.setToken(token);
        }
    }
};


export const getExisingCanvas = async (roomId: string) => {

    const token = authTokenProvider.getToken();

    if (!token) {
        console.log(`token not found in /draw/index`);
    }

    try {

        const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/api/v1/chats/${roomId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const messages = response.data.messages;

        const shapes = messages.filter((message: { message: string }) => {
            try {
                const parsed = JSON.parse(message.message);
                if (!parsed || !parsed.shape || !parsed.shape.id) return false;
                // Filtering out invalid shapes
                if (parsed.shape.type === "circle" && parsed.shape.radius === 0) return false;
                if (parsed.shape.type === "rect" && (parsed.shape.width === 0 || parsed.shape.height === 0)) return false;
                if (parsed.shape.type === "line" &&
                    (parsed.shape.startX === parsed.shape.endX && parsed.shape.startY === parsed.shape.endY)) return false;
                if (parsed.shape.type === "arrow" &&
                    (parsed.shape.startX === parsed.shape.endX && parsed.shape.startY === parsed.shape.endY)) return false;
                // return parsed && parsed.shape && parsed.shape.id;
                return true;
            } catch (err) {
                console.log("Error parsing message: ", err);
                return;
            }
        }).map((message: { message: string }) => {

            const messageData = JSON.parse(message.message);
            return messageData.shape;
        });

        return shapes;

    } catch (err) {
        console.log(`Error fetching canvas data: ${err}`);
        return [];
    }



}