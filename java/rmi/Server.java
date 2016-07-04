package rmi;

public class Server {
	 
    public static void main(String[] args) throws Exception {
        String host = "127.0.0.1";
        int port = 1199;
 
        ServiceProvider provider = new ServiceProvider();
 
        HelloService helloService = new HelloServiceImpl(); 
        provider.publish(helloService, host, port);
 
  //      Thread.sleep(Long.MAX_VALUE);
    }
}
