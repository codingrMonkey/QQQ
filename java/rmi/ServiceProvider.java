package rmi;


import java.rmi.Naming;
import java.rmi.Remote;
import java.rmi.registry.LocateRegistry;
import java.util.concurrent.CountDownLatch;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;

public class ServiceProvider {
	    // 用于等待 SyncConnected 事件触发后继续执行当前线程
	    private CountDownLatch latch = new CountDownLatch(1);
	 
	    // 发布 RMI 服务并注册 RMI 地址到 ZooKeeper 中
	    public void publish(Remote remote, String host, int port) {
	        String url = publishService(remote, host, port); // 发布 RMI 服务并返回 RMI 地址
	        if (url != null) {
	            ZooKeeper zk = connectServer(); // 连接 ZooKeeper 服务器并获取 ZooKeeper 对象
	            if (zk != null) {
	                createNode(zk, url); // 创建 ZNode 并将 RMI 地址放入 ZNode 上
	            }
	        }
	    }
	 
	    // 发布 RMI 服务
	    private String publishService(Remote remote, String host, int port) {
	        String url = null;
	        try {
	            url = String.format("rmi://%s:%d/%s", host, port, remote.getClass().getName());
	            LocateRegistry.createRegistry(port);
	            Naming.rebind(url, remote);
	            System.out.println("publish rmi service (url: {})" +  url);
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }
	        return url;
	    }
	 
	    // 连接 ZooKeeper 服务器
	    private ZooKeeper connectServer() {
	        ZooKeeper zk = null;
	        try {
	            zk = new ZooKeeper(Constant.ZK_CONNECTION_STRING, Constant.ZK_SESSION_TIMEOUT, new Watcher() {
	                @Override
	                public void process(WatchedEvent event) {
	                    if (event.getState() == Event.KeeperState.SyncConnected) {
	                    	System.out.println("connected to zookeeper server..");
	                        latch.countDown(); // 唤醒当前正在执行的线程
	                        System.out.println("after connected to zookeeper server; latch number is : " + latch.getCount());
	                    }
	                }
	            });
	            latch.await(); // 使当前线程处于等待状态
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }
	        return zk;
	    }
	 
	    // 创建 ZNode
	    private void createNode(ZooKeeper zk, String url) {
	        try {
	        	if(zk.exists(Constant.ZK_REGISTRY_PATH, false) == null){//不存在则创建
	        		String tempP = zk.create(Constant.ZK_REGISTRY_PATH, new byte[0], ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
	        		System.out.println(tempP);
	        	}
	            byte[] data = url.getBytes();
	            String path = zk.create(Constant.ZK_PROVIDER_PATH, data, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);    // 创建一个临时性且有序的 ZNode
	            System.out.println("node : " +  path  + "\nurl : " +  url);
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }
	    }
}
