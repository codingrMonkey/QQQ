package test;

import java.util.concurrent.CountDownLatch;

public class TestJoin {
	public static void main(String[] args) {
		final CountDownLatch cdl = new CountDownLatch(1);
		final CountDownLatch cd2 = new CountDownLatch(1);
		Thread t1 = new Thread(new Runnable() {
			public void run() {
				cdl.countDown();
				System.out.println("t1");
			}
		});
		Thread t2 = new Thread(new Runnable() {
			public void run() {
				try {
					cdl.await();
					cd2.countDown();
				} catch (InterruptedException e) {
				}
				System.out.println("t2");
			}
		});
		Thread t3 = new Thread(new Runnable() {
			public void run() {
				try {
					cd2.await();
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
				System.out.println("t3");
			}
		});
		t3.start();
		t2.start();
		t1.start();
	}

}
