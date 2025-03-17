import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";  
import { usePrivy } from "@privy-io/react-auth";
import {useLogout} from '@privy-io/react-auth';

export function usePrivyLogin() {
  const router = useRouter();
  const { getAccessToken } = usePrivy();
  
  return useLogin({
    onComplete: async ({user, isNewUser, wasAlreadyAuthenticated, loginMethod}) => {
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);
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
      //router.push("/home");
    },
    onError: (error) => {
      console.error("Error en el login:", error);
    },
  });
}


export function usePrivyLogout() {
  const router = useRouter();

  return useLogout({
    onSuccess: () => {
      console.log('User logged out');
      router.push("/");
      // Any logic you'd like to execute after a user successfully logs out
    },
  });
}