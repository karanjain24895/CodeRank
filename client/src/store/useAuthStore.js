import { create } from "zustand";

const useAuthStore =
    create((set) => ({

        authUser:
            JSON.parse(
                localStorage.getItem(
                    "authUser"
                )
            ) || null,

        setAuthUser:
            (user) => {

                if (user) {

                    localStorage.setItem(
                        "authUser",
                        JSON.stringify(
                            user
                        )
                    );

                } else {

                    localStorage.removeItem(
                        "authUser"
                    );
                }

                set({
                    authUser:
                        user,
                });
            },
    }));

export default useAuthStore;