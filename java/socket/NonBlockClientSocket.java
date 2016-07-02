package socket;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class NonBlockClientSocket {
	public static void main(String[] args) throws Exception {
		for (int i = 0; i < 50; i++) {
			new Thread(new NonBlockClientSocketThread()).start();
		}
	}
}

class NonBlockClientSocketThread implements Runnable {
	@Override
	public void run() {
		try {
			SocketChannel socketChannel = SocketChannel.open();
			socketChannel.configureBlocking(false);
			socketChannel.connect(new InetSocketAddress("127.0.0.1", 8888));
			while(!socketChannel.finishConnect()){
				System.out.print(".");
			}
			System.out.println("client connect success");
		//	byte[] bytes = (Thread.currentThread().getName() + "--->abcd").getBytes();
		//	System.out.println("bytes length = " + bytes.length);
			for(int i=0;i<100000;i++){
				ByteBuffer buf = ByteBuffer.wrap((Thread.currentThread().getName() + "--->abcd" + i).getBytes());
				socketChannel.write(buf);
				Thread.sleep(2000);
			}
			socketChannel.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
