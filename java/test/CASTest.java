package test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class CASTest {
	static int threadNum = 1000;
	static CountDownLatch countDownLatch = new CountDownLatch(threadNum);
	public static void main(String[] args) throws Exception {
		long currTime = System.currentTimeMillis();
		ShareObject shareObject = new ShareObject();
		for(int i=0;i<threadNum;i++){
			new Thread(new CASThread(shareObject,countDownLatch)).start();
		}
		countDownLatch.await();
		System.out.println(shareObject.getNum());
		System.out.println(System.currentTimeMillis() - currTime);
	}
}
class ShareObject{
	Lock lock = new ReentrantLock();
	volatile int num = 0;
	public int getNum() {
		return num;
	}
	public void setNum(){
		lock.lock();
		num++;
		lock.unlock();
	}
}
class CASThread implements Runnable{
	private ShareObject shareObj;
	private CountDownLatch countDownLatch;
	public CASThread(ShareObject shareObject,CountDownLatch countDownLatch) {
		this.shareObj = shareObject;
		this.countDownLatch = countDownLatch;
	}
	@Override
	public void run() {
		shareObj.setNum();
		countDownLatch.countDown();
	}
}
