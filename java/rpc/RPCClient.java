package rpc;

import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.Socket;

public class RPCClient {
	private static Component rpc;
	static{
		RPCInvocationHandler h = new RPCInvocationHandler();
		Object obj = Proxy.newProxyInstance(RPCClient.class.getClassLoader(), new Class[]{Component.class}, h);
		rpc = (Component)obj;
	}
	public static void main(String[] args) {
		String result = rpc.doSomething("hello,world");
		System.out.println("RPC 调用返回的结果是 : " + result);
	}
}
class RPCInvocationHandler implements InvocationHandler{
	@Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {
		//这里执行对象的序列化进行接口的调用
		Socket socket = new Socket("127.0.0.1", 7890);
		OutputStream out = socket.getOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(out);
		PRCObject param = new PRCObject();
		param.setClassQufiedName(proxy.getClass().getInterfaces()[0].getName());
		param.setMethodName(method.getName());
		param.setParams(args);
		oos.writeObject(param);
		InputStream in = socket.getInputStream();
		ObjectInputStream ois = new ObjectInputStream(in);
		Object result = ois.readObject();
		ois.close();
		in.close();
		oos.close();
		out.close();
		socket.close();
		return result;
	}
	
}
