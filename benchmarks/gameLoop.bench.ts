import { it } from "vitest";
import gameLoopTick from "../src/game/gameLoop/tick";
import { importPlayer } from "../src/game/player/persistence/import";
import initializeGlobals from "../src/main/globals";
import startGame from "../src/main/startGame";

it("game loop", async ({ bench }) => {
  await bench(
    "ticks",
    {
      beforeAll: () => {
        initializeGlobals();
        startGame();
        importPlayer(
          "N4IgtghgVg9gTiAXARgDTgJYDt5IEzoAOEALgMYAWSA7AL6rLUCcALAAwsBsyArMm6wB07NmhAh0EkAGcyGAKZYSGAGYYyUzalAAbeQDd5OpAG0ScAK7zU5qzcvXbjh-asBddFgs6dGElUQzFydXZzsQiOCo8IcPEEM4MABPOBhpU0iYrLCc0LzM+TjleQRAgvzonLi4eWl5EgzKuIATEpIYbAayyor3dEgfDDguoOzewvQADwgAcxS0xvd6UEIOpSQQHmYAZmopCDBCXxUdC0mNnh5WNikE5JJ5DeQADn4pMnhHxBB2KVbhtZdEB4FjbfaHXz6DrNJ6cMHLEA1OpdUAGEoABRKKngYHkMMQIRkJAgwzxABFSF9GFtntRnnhqNRkHhkIJOK8CCAMNIAGJDaQkABKtXqSEJEAs7QAolgIAAjPT4lQQHR1dBI+rSTFwADK8g+WHxbHoIGKpVRCW12MSeLFLiJJIezQpDyQ1LpdIZTJZbI56G5fLgAuFyKQytV1hAEulsoVtoJ9o1JC1JT1BqNJru83SiAtGKxOPjhIFjvJlLd1BpnsZzNZ7OZ-t5-KFIq64slMBl8sVYZVasRrZTuv1MENSGNnm8vn8SDzcCthfxxeJpOd5ZQlY99OoeGenB4gjpYgDzZDooTdijHa7caVfcjSaHadHGf6Kt8w1nIDR84LNqX9olquLpUoy9LPDwbDPM8TB7oI2ycKwjaBsGrZ2pe0adrGPaIOG-aPtqz5jogE4gHohjGLm36Wn+uIAZeQFOiBFaehBUEwXBCFIVyTZBi2oa4fe6CYTeOF4Q+g6ESOxGkdMcypDmc4Lv+6GRoxZauhu1AsOwuzILseCcGy7KciefFnl04nCde2HxlZA7Ik+0kZia0i+IQVDoNsgjIJwflMHgbDbHgTDILw1BsJw8gsDw0FSG8Xk+X5iGBcFoXhZF0Wxc88U8HgeDxYIMGXMw3A8AhbCGUw8gvDl6B4MI2zbHlrxsJccLcHg8hNUwnBSCwPmwW1+6sAyUGwfIPA6VI1CCJFMVhZwLB4E1yCwV15V1SA3n5QI+X7s1vl4FN2w1XSYKSOgvCBVIPCFTwS0CFsEVrUwsHUFF2z0iCM1zfpzzNTBbVTSwzwsN1YNMHd4yJey2xsJVAMsAFkHw1Fy2Q1I3lMM1XAfTu2xMNQCGcNQNVens6ADU1TKcAI2nlRwzDddD5QgEwbAAKT9YIfCMCFON+Ww2kCCzEiEqy7DsNB+WBVBOxRSCyBY-B7JLcyxNfcFEU8PIILQ+IDAPW9S2Ia8RXw5FPB5MCc2E19laMIyohMmTzIsDzUExe1sWQVchmTRdhs-LzCEfU1sVBcVisXRLytXfH7PCEFx2iAjtPbCwbuXCrvn+alIVhVsmUxXF9WCAFu4gvDdLQaCZPI1oPwNe1IVMjpRPHZWEgmCAqydOkcQDS8JlfVLpsTSFUjPHbm7cJVO4vAh3U3FTh58KCvUfS8OPPHrBusgha2GYwsFQyyx37yAQA",
        );
      },
    },
    () => {
      gameLoopTick();
    },
  ).run({ iterations: 10_000 });
});
