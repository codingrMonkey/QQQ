package socket;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class SocketServer {
	public static void main(String[] args) throws Exception {
		ThreadPoolExecutor threadPool = new ThreadPoolExecutor(12, 20, 100, TimeUnit.SECONDS, new LinkedBlockingDeque<Runnable>());
		ServerSocket serverSocket = new ServerSocket(3223,100000);
		while(true){
			Socket socket  = serverSocket.accept();
			threadPool.execute(new SocketServerThread(socket));
		}
	}
}
class SocketServerThread implements Runnable{
	private Socket socket;
	public SocketServerThread(Socket socket){
		this.socket = socket;
	}
	@Override
	public void run() {
		try{
			InputStream is = socket.getInputStream();
			InputStreamReader isr = new InputStreamReader(is);
			BufferedReader br = new BufferedReader(isr);
			String str = null;
			while((str = br.readLine()) != null){
				System.out.println(Thread.currentThread().getName() + str);
			}
			br.close();
			isr.close();
			is.close();
			socket.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}