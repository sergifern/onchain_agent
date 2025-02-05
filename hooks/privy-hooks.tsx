import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";  
import { usePrivy } from "@privy-io/react-auth";

export function usePrivyLogin() {
  const router = useRouter();
  const { getAccessToken } = usePrivy();
  
  return useLogin({
    onComplete: async ({user, isNewUser, wasAlreadyAuthenticated, loginMethod}) => {
      //console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);
      if (isNewUser) {
        console.log("Nuevo usuario registrado");
        
        const accessToken = await getAccessToken();

        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ user }),
            headers: {
                'Authorization': `Bearer ${accessToken}`, 
            }
        });
      }

      const accessToken = await getAccessToken();
      const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${accessToken}`, 
          }
      });

      // route to /home
      router.push("/home");
    },
    onError: (error) => {
      console.error("Error en el login:", error);
    },
  });
}
