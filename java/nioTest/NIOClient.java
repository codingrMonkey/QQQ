package nioTest;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class NIOClient {
	public static void main(String[] args) throws Exception{
		SocketChannel sc = SocketChannel.open();
		sc.configureBlocking(false);
		sc.connect(new InetSocketAddress("127.0.0.1",9999));
		while(!sc.finishConnect()){
			System.out.print(".");
		}
		ByteBuffer buf = ByteBuffer.wrap("hello,world".getBytes());
		sc.write(buf);
		sc.close();
	}
}
