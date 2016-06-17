package socket;

import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;

public class NonBlockServerSocket {
	public static void main(String[] args) throws Exception {
		Selector selector = Selector.open();
		ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
		serverSocketChannel.configureBlocking(false);
		ServerSocket serverSocket = serverSocketChannel.socket();
		serverSocket.bind(new InetSocketAddress(8888));
		serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);
		while (true) {
			if (selector.select(5000) == 0) {
				System.out.println(".");
				continue;
			}
			Iterator<SelectionKey> iterator = selector.selectedKeys()
					.iterator();
			while (iterator.hasNext()) {
				try{

					SelectionKey key = iterator.next();
					if (key.isAcceptable()) {
						System.out.println("it is accept now....");
						SocketChannel clntChan = ((ServerSocketChannel) key
								.channel()).accept();
						clntChan.configureBlocking(false);
						// 将选择器注册到连接到的客户端信道，并指定该信道key值的属性为OP_READ，同时为该信道指定关联的附件
						clntChan.register(key.selector(), SelectionKey.OP_READ,
								ByteBuffer.allocate(512));
					}
					if (key.isReadable()) {
						System.out.println("it is readable now....");
						SocketChannel clntChan = (SocketChannel) key.channel();
						// 获取该信道所关联的附件，这里为缓冲区
						ByteBuffer buf = (ByteBuffer) key.attachment();
						long bytesRead = clntChan.read(buf);
						// 如果read（）方法返回-1，说明客户端关闭了连接，那么客户端已经接收到了与自己发送字节数相等的数据，可以安全地关闭
						if (bytesRead == -1) {
							clntChan.close();
						} else if (bytesRead > 0) {
							buf.flip();
							byte[] bytes = new byte[buf.limit()];
							buf.get(bytes);
							System.out.println("缓冲区读入的数据 > " + new String(bytes));
							// 如果缓冲区总读入了数据，则将该信道感兴趣的操作设置为为可读可写
							key.interestOps(SelectionKey.OP_READ
									| SelectionKey.OP_WRITE);
						}
					}
					if (key.isValid() && key.isWritable()) {

						// 获取与该信道关联的缓冲区，里面有之前读取到的数据
						ByteBuffer buf = (ByteBuffer) key.attachment();
						// 重置缓冲区，准备将数据写入信道
						buf.flip();
						SocketChannel clntChan = (SocketChannel) key.channel();
						// 将数据写入到信道中
						clntChan.write(buf);
						if (!buf.hasRemaining()) {
							// 如果缓冲区中的数据已经全部写入了信道，则将该信道感兴趣的操作设置为可读
							key.interestOps(SelectionKey.OP_READ);
						}
						// 为读入更多的数据腾出空间
						buf.compact();

					}
					iterator.remove();
				
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		}
	}
}
