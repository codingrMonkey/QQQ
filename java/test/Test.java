package test;

import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;



public class Test {
	public static void main(String[] args) {
		ShareObj obj = new ShareObj();
		for(int i=0;i<10000;i++){
			new Thread(new T(obj,i)).start();
		}
	}
}
class T implements Runnable{
	private ShareObj obj;
	private int k;
	T(ShareObj obj,int k){
		this.obj = obj;
		this.k = k;
	}
	@Override
	public void run() {
		if(k%2 == 0){
			obj.plusNum();
		}else{
			obj.readNum();
		}
	}
}
class ShareObj{
	ReadWriteLock lock = new ReentrantReadWriteLock();
	private int num = 0;
	public void plusNum(){
		lock.writeLock().lock();
		System.out.println("before lock" + num);
		num++;
		System.out.println("after lock" + num);
		lock.writeLock().unlock();
	}
	public void readNum(){
		lock.readLock().lock();
		System.out.println("read " + num);
		lock.readLock().unlock();
	}
}