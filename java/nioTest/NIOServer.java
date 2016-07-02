package nioTest;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;

public class NIOServer {
	public static void main(String[] args) throws Exception{
		ServerSocketChannel server = ServerSocketChannel.open();
		server.configureBlocking(false);
		server.socket().bind(new InetSocketAddress(9999));
		Selector selector = Selector.open();
		server.register(selector, SelectionKey.OP_ACCEPT);
		while(true){
			if(selector.select(3000) == 0){
				System.out.println(".");
			}
			Iterator<SelectionKey> iterator = selector.selectedKeys().iterator();
			while(iterator.hasNext()){
				SelectionKey key = iterator.next();
				SocketChannel sc = ((ServerSocketChannel)key.channel()).accept();
				ByteBuffer buf = ByteBuffer.allocate(256);
				sc.read(buf);
				System.out.println(new String(buf2bytes(buf)));
				iterator.remove();
			}
		}
	}
	private static byte[] buf2bytes(ByteBuffer buf){
		buf.flip();
		byte[] bytes = new byte[buf.limit()];
		buf.get(bytes, buf.position(), buf.limit());
		return bytes;
	}
}
