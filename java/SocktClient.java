package socket;

import java.io.BufferedWriter;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.Socket;

public class SocktClient {
	public static void main(String[] args) throws Exception, Exception {
		for(int i=0;i<4000;i++){
			new Thread(new SocketClientThread()).start();
		}
	}
}
class SocketClientThread implements Runnable{
	@Override
	public void run() {
		try{
			Socket socketClient = new Socket("127.0.0.1",3223);
			OutputStream os = socketClient.getOutputStream();
			OutputStreamWriter osw = new OutputStreamWriter(os);
			BufferedWriter bw = new BufferedWriter(osw);
			for(int i=0;i<1000;i++){
				bw.write("hello,world" + i + "\n");
			}
			bw.close();
			osw.close();
			os.close();
			socketClient.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
} 
