package rpc;

import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RPCServer {
	private static Map<String,Object> map = new ConcurrentHashMap<String, Object>();
	static{
		map.put("rpc.Component", new ComponentImpl());
	}
	public static void main(String[] args) throws Exception {
		ServerSocket server = new ServerSocket(7890);
		while(true){
			Socket socket = server.accept();
			InputStream in = socket.getInputStream();
			ObjectInputStream ois = new ObjectInputStream(in);
			PRCObject obj = (PRCObject)ois.readObject();
			String qulifiedName = obj.getClassQufiedName();
			Object[] params = obj.getParams();
			Class<?>[] parameterTypes = new Class[params.length];
			for(int i=0;i<params.length;i++){
				parameterTypes[i] = params[i].getClass();
			}
			Object executeObj = map.get(qulifiedName);
			Method mehtod = executeObj.getClass().getMethod(obj.getMethodName(), parameterTypes);
			Object result = mehtod.invoke(executeObj,params);
			OutputStream out = socket.getOutputStream();
			ObjectOutputStream oos = new ObjectOutputStream(out);
			oos.writeObject(result);
			oos.close();
			out.close();
			ois.close();
			in.close();
			socket.close();
		}
	}
}
